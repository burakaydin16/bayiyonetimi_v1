
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Customer, Product, Transaction, TransactionItem, ProductType } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Trash, Save, Factory, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const Transactions: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [mode, setMode] = useState<'CustomerOp' | 'FactoryOp'>('CustomerOp');

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const load = async () => {
        const c = await DataService.getCustomers();
        const p = await DataService.getProducts();
        setCustomers(c);
        setProducts(p);
    };
    load();
  }, []);

  const addItem = () => {
      if (products.length === 0) return;
      setItems([...items, { 
          product_id: products[0].id, 
          quantity: 1, 
          item_type: mode === 'CustomerOp' ? 'Gonderilen' : 'StokGirisi', 
          unit_price: products[0].price 
      }]);
  };

  const updateItem = (index: number, field: keyof TransactionItem, value: any) => {
      const newItems = [...items];
      const item = newItems[index];
      
      if (field === 'product_id') {
          const product = products.find(p => p.id === value);
          item.product_id = value;
          item.unit_price = product ? product.price : 0;
      } else {
          (item as any)[field] = value;
      }
      setItems(newItems);
  };

  const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
      if (mode === 'CustomerOp' && !selectedCustomer) return;
      if (items.length === 0) return;

      const transaction: Transaction = {
          id: '', // Supabase üretecek
          date: new Date().toISOString(),
          customer_id: mode === 'CustomerOp' ? selectedCustomer : undefined,
          items: items,
          total_amount: 0, 
          type: mode
      };

      setLoading(true);
      try {
          await DataService.processTransaction(transaction);
          setSuccessMsg('İşlem başarıyla kaydedildi!');
          setItems([]);
          setSelectedCustomer('');
          setTimeout(() => setSuccessMsg(''), 3000);
      } catch (error) {
          console.error(error);
          alert('İşlem sırasında bir hata oluştu.');
      } finally {
          setLoading(false);
      }
  };

  const totalMoney = items.reduce((acc, item) => {
      if (item.item_type === 'Gonderilen') {
         const p = products.find(prod => prod.id === item.product_id);
         if (p && p.type === ProductType.WATER) return acc + (item.quantity * item.unit_price);
      }
      return acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h2 className="text-2xl font-bold text-gray-900">Hareket Ekle</h2>
              <p className="text-gray-500 text-sm">Satış, iade veya stok girişi yapın.</p>
          </div>
          {successMsg && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle size={18} />
                  <span className="font-medium">{successMsg}</span>
              </div>
          )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mode Selection */}
          <div className="flex border-b border-gray-100">
              <button 
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${mode === 'CustomerOp' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                onClick={() => { setMode('CustomerOp'); setItems([]); }}
              >
                  <User size={20} />
                  Müşteri / Bayi İşlemi
              </button>
              <button 
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${mode === 'FactoryOp' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                onClick={() => { setMode('FactoryOp'); setItems([]); }}
              >
                  <Factory size={20} />
                  Fabrika Stok Girişi
              </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
              {/* Customer Selection */}
              {mode === 'CustomerOp' && (
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri / Bayi Seçimi</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl p-4 pr-10 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            value={selectedCustomer}
                            onChange={e => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">Müşteri Seçiniz...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ArrowRight size={16} className="rotate-90" />
                        </div>
                    </div>
                </div>
              )}

               {mode === 'FactoryOp' && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3 text-indigo-800 text-sm">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <div>
                          <span className="font-bold block mb-1">Fabrika Giriş Modu</span>
                          Gireceğiniz ürünler doğrudan stoğunuza eklenecektir. Bu işlem müşteri cari hesaplarına yansımaz, sadece depo stoğunu artırır.
                      </div>
                  </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">İşlem Kalemleri</h3>
                      <Button size="sm" onClick={addItem} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0">
                          <Plus size={16} className="mr-1" /> Satır Ekle
                      </Button>
                  </div>

                  {items.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <p>Henüz ürün eklenmedi.</p>
                          <p className="text-sm mt-1">Yukarıdaki butona tıklayarak ürün ekleyin.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {items.map((item, index) => (
                              <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                                  <div className="flex-1 w-full md:w-auto">
                                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">İşlem Türü</p>
                                      <select 
                                        className={`w-full p-2.5 rounded-lg border font-medium outline-none focus:ring-2 focus:ring-opacity-50 ${item.item_type === 'Gonderilen' ? 'text-blue-700 bg-blue-50 border-blue-200 focus:ring-blue-500' : item.item_type === 'IadeAlinan' ? 'text-green-700 bg-green-50 border-green-200 focus:ring-green-500' : 'text-indigo-700 bg-indigo-50 border-indigo-200 focus:ring-indigo-500'}`}
                                        value={item.item_type}
                                        onChange={e => updateItem(index, 'item_type', e.target.value)}
                                        disabled={mode === 'FactoryOp'} 
                                      >
                                          {mode === 'CustomerOp' ? (
                                              <>
                                                <option value="Gonderilen">Satış / Gönderim (Çıkış)</option>
                                                <option value="IadeAlinan">Boş İade Alma (Giriş)</option>
                                              </>
                                          ) : (
                                              <option value="StokGirisi">Stok Girişi</option>
                                          )}
                                      </select>
                                  </div>

                                  <div className="flex-[2] w-full md:w-auto">
                                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Ürün</p>
                                      <select 
                                         className="w-full p-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                         value={item.product_id}
                                         onChange={e => updateItem(index, 'product_id', e.target.value)}
                                      >
                                          {products.map(p => (
                                              <option key={p.id} value={p.id}>
                                                  {p.name} {item.item_type === 'Gonderilen' && p.type === ProductType.WATER ? `(₺${p.price})` : ''}
                                              </option>
                                          ))}
                                      </select>
                                  </div>

                                  <div className="w-full md:w-32">
                                      <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Adet</p>
                                      <input 
                                          type="number" 
                                          min="1"
                                          className="w-full p-2.5 rounded-lg border border-gray-200 text-center font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                          value={item.quantity}
                                          onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                      />
                                  </div>

                                  <button onClick={() => removeItem(index)} className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors mt-auto md:mt-0">
                                      <Trash size={20} />
                                  </button>
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* Footer / Summary */}
              <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-gray-600 bg-gray-50 px-6 py-4 rounded-xl w-full md:w-auto">
                      {mode === 'CustomerOp' && (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm">Tahmini Tutar</span>
                            <span className="font-bold text-2xl text-gray-900">₺{totalMoney.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <CheckCircle size={12} /> Depozito bakiyeleri otomatik işlenir
                            </span>
                        </div>
                      )}
                      {mode === 'FactoryOp' && (
                          <div className="flex flex-col gap-1">
                              <span className="text-sm">Toplam Miktar</span>
                              <span className="font-bold text-2xl text-gray-900">{items.reduce((acc, i) => acc + i.quantity, 0)} <span className="text-base font-normal text-gray-500">Adet</span></span>
                          </div>
                      )}
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleSubmit} 
                    disabled={loading || (mode === 'CustomerOp' && !selectedCustomer) || items.length === 0}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 py-4 text-lg"
                  >
                      {loading ? 'İşleniyor...' : (
                          <>
                            <Save size={20} className="mr-2" />
                            {mode === 'CustomerOp' ? 'Hareketi Kaydet' : 'Stok Girişini Onayla'}
                          </>
                      )}
                  </Button>
              </div>
          </div>
      </div>
    </div>
  );
};
