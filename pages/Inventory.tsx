
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Product, ProductType } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Edit, AlertCircle, Package, Droplets, Truck } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    type: ProductType.WATER,
    price: 0,
    deposit_price: 0,
    stock: 0,
    linked_deposit_id: ''
  });

  const loadProducts = async () => {
      const data = await DataService.getProducts();
      setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async () => {
    if (!formData.name) return;

    if (editingProduct) {
        const productToSave: Product = { 
            ...editingProduct, 
            ...formData, 
            stock: editingProduct.stock 
        } as Product;
        await DataService.saveProduct(productToSave);
    } else {
        const newProduct = {
            name: formData.name!,
            type: formData.type || ProductType.WATER,
            price: Number(formData.price) || 0,
            deposit_price: 0,
            stock: Number(formData.stock) || 0,
            linked_deposit_id: formData.linked_deposit_id
        };
        // @ts-ignore - ID is optional on creation
        await DataService.saveProduct(newProduct);
    }
    
    await loadProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const openEdit = (product: Product) => {
      setEditingProduct(product);
      setFormData(product);
      setIsModalOpen(true);
  };

  const openNew = () => {
      setEditingProduct(null);
      setFormData({ type: ProductType.WATER, price: 0, deposit_price: 0, stock: 0 });
      setIsModalOpen(true);
  }

  const handleDelete = async (id: string) => {
      if(!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
      await DataService.deleteProduct(id);
      await loadProducts();
  };

  const getProductIcon = (type: string) => {
      switch(type) {
          case ProductType.WATER: return <Droplets size={18} className="text-blue-500" />;
          case ProductType.DEPOSIT: return <Truck size={18} className="text-orange-500" />;
          default: return <Package size={18} className="text-gray-500" />;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Stok ve Ürün Yönetimi</h2>
            <p className="text-gray-500 text-sm">Ürünlerinizi tanımlayın ve stok durumunu izleyin.</p>
        </div>
        <Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
            <Plus size={18} className="mr-2" />
            Yeni Ürün Ekle
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-medium text-sm uppercase tracking-wider">
                    <tr>
                        <th className="p-4 pl-6">Ürün Adı</th>
                        <th className="p-4">Tip</th>
                        <th className="p-4">Birim Fiyat</th>
                        <th className="p-4">Stok Adedi</th>
                        <th className="p-4">Bağlı Depozito</th>
                        <th className="p-4 pr-6 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-400">
                                Henüz ürün bulunmuyor.
                            </td>
                        </tr>
                    ) : (
                        products.map(product => {
                            const linkedName = products.find(p => p.id === product.linked_deposit_id)?.name;
                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 pl-6 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                                {getProductIcon(product.type)}
                                            </div>
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            product.type === ProductType.WATER ? 'bg-blue-50 text-blue-700' : 
                                            product.type === ProductType.DEPOSIT ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {product.type === ProductType.WATER ? 'Su Ürünü' : 
                                             product.type === ProductType.DEPOSIT ? 'Depozito' : 'Diğer'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">₺{product.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`font-bold ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {linkedName ? (
                                            <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit text-xs">
                                                <Truck size={12} /> {linkedName}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4 pr-6 text-right space-x-2">
                                        <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-6 shadow-2xl">
                <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                        <input 
                            type="text" 
                            placeholder="Örn: 19L Damacana Su"
                            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                            value={formData.name || ''} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Tipi</label>
                        <select 
                            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as ProductType})}
                        >
                            <option value={ProductType.WATER}>Su Ürünü (Satılık)</option>
                            <option value={ProductType.DEPOSIT}>Depozito (Boş Kap/Palet)</option>
                            <option value={ProductType.OTHER}>Diğer</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Satış Fiyatı (TL)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                            <input 
                                type="number" 
                                className="w-full border border-gray-200 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                            />
                        </div>
                    </div>
                        
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Stok</label>
                        <input 
                            type="number" 
                            className={`w-full border border-gray-200 rounded-lg p-3 outline-none ${editingProduct ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            value={formData.stock} 
                            onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                            disabled={!!editingProduct} 
                        />
                        {editingProduct && (
                            <p className="text-xs text-orange-600 flex items-center mt-2 bg-orange-50 p-2 rounded">
                                <AlertCircle size={14} className="mr-1.5 shrink-0"/> 
                                Stok değişimi için "Hareket Ekle" menüsünü kullanın.
                            </p>
                        )}
                    </div>

                    {formData.type === ProductType.WATER && (
                         <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <label className="block text-sm font-medium text-blue-900 mb-1">Bağlı Depozito (Boş) Ürünü</label>
                            <select 
                                className="w-full border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.linked_deposit_id || ''}
                                onChange={e => setFormData({...formData, linked_deposit_id: e.target.value})}
                            >
                                <option value="">Yok</option>
                                {products.filter(p => p.type === ProductType.DEPOSIT).map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-blue-600 mt-1">Bu ürün satıldığında, müşteriye otomatik olarak seçilen boş ürün borcu yazılır.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>İptal</Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Kaydet</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
