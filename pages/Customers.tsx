
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Customer, Product } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Phone, MapPin, ChevronDown, ChevronUp, Search, User, Building2 } from 'lucide-react';

export const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ name: '', type: 'Bayi', phone: '', address: '', cash_balance: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const loadData = async () => {
        const c = await DataService.getCustomers();
        const p = await DataService.getProducts();
        setCustomers(c);
        setProducts(p);
    }

    useEffect(() => {
        loadData();

        if (searchParams.get('action') === 'new') {
            setIsModalOpen(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams]);

    const handleSave = async () => {
        if (!newCustomer.name) return;
        const customer = {
            name: newCustomer.name!,
            type: newCustomer.type as any,
            phone: newCustomer.phone || '',
            address: newCustomer.address || '',
            cash_balance: 0
        };

        // @ts-ignore
        await DataService.saveCustomer(customer);
        await loadData();

        setIsModalOpen(false);
        setNewCustomer({ name: '', type: 'Bayi', phone: '', address: '' });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bayiler ve Müşteriler</h2>
                    <p className="text-gray-500 text-sm">Müşteri listesi ve cari hesap durumları.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                    <Plus size={18} className="mr-2" />
                    Müşteri Ekle
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Müşteri adı veya telefon ara..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${customer.type === 'Bayi' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {customer.type === 'Bayi' ? <Building2 size={20} /> : <User size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{customer.name}</h3>
                                        <span className="text-xs text-gray-500">{customer.type}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Bakiye</p>
                                    <p className={`font-bold text-lg ${customer.cash_balance > 0 ? 'text-red-600' : customer.cash_balance < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {customer.cash_balance > 0 ? `+₺${customer.cash_balance}` : `₺${customer.cash_balance}`}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{customer.phone || 'Telefon yok'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span className="truncate">{customer.address || 'Adres yok'}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => toggleExpand(customer.id)}
                                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                        Depozito Durumu
                                    </span>
                                    {expandedId === customer.id ? <ChevronUp size={16} /> : <ChevronDown size={16} className="text-gray-400 group-hover:text-blue-600" />}
                                </button>

                                {expandedId === customer.id && (
                                    <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                                        {customer.deposit_balances && Object.entries(customer.deposit_balances).map(([prodId, value]) => {
                                            const qty = Number(value);
                                            const prodName = products.find(p => p.id === prodId)?.name || 'Bilinmeyen Ürün';
                                            if (qty === 0) return null;

                                            return (
                                                <div key={prodId} className="flex justify-between items-center text-sm p-2 rounded bg-orange-50 border border-orange-100">
                                                    <span className="text-gray-700 truncate mr-2">{prodName}</span>
                                                    <span className={`font-bold text-xs px-2 py-1 rounded ${qty > 0 ? 'bg-white text-red-700 border border-red-100' : 'bg-white text-green-700 border border-green-100'}`}>
                                                        {qty > 0 ? `${qty} Borçlu` : `${Math.abs(qty)} Alacaklı`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {(!customer.deposit_balances || Object.values(customer.deposit_balances).every(v => Number(v) === 0)) && (
                                            <p className="text-gray-400 text-xs italic text-center py-2">Depozito hareketi yok.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Fixed Header */}
                        <div className="flex justify-between items-center p-6 border-b shrink-0">
                            <h3 className="text-xl font-bold text-gray-900">Yeni Müşteri/Bayi Ekle</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adı Soyadı / Firma Adı</label>
                                <input
                                    placeholder="Örn: Ahmet Yılmaz Market"
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Tipi</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={newCustomer.type}
                                    onChange={e => setNewCustomer({ ...newCustomer, type: e.target.value as any })}
                                >
                                    <option value="Bayi">Bayi (Toptan)</option>
                                    <option value="Perakende">Perakende (Bireysel)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    placeholder="05XX XXX XX XX"
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newCustomer.phone}
                                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea
                                    placeholder="Açık adres..."
                                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                                    value={newCustomer.address}
                                    onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t shrink-0 bg-gray-50/50 rounded-b-2xl">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="px-6">İptal</Button>
                            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-md">Kaydet</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
