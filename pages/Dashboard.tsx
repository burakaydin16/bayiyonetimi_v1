
import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Product, Transaction, Customer } from '../types';
import { Package, Wallet, Download, Truck, ArrowUpRight, ArrowDownLeft, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardProps {
    onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [stats, setStats] = useState({
        stock: [] as Product[],
        transactions: [] as Transaction[],
        customers: [] as Customer[],
    });

    useEffect(() => {
        const loadData = async () => {
            const stock = await DataService.getProducts();
            const transactions = await DataService.getTransactions();
            const customers = await DataService.getCustomers();

            setStats({ stock, transactions, customers });
        };
        loadData();
    }, []);

    const handleBackup = async () => {
        try {
            const exportData = {
                products: stats.stock,
                customers: stats.customers,
                transactions: stats.transactions,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `su_takip_yedek_${new Date().toLocaleDateString()}.json`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Yedek alma hatası:", error);
            alert("Yedek oluşturulurken bir hata oluştu.");
        }
    };

    // Toplam Alacak Hesaplama
    const totalReceivables = stats.customers.reduce((acc, c) => acc + (c.cash_balance > 0 ? c.cash_balance : 0), 0);

    // Dışarıdaki Depozitoları Ürün Bazlı Hesaplama
    const marketDeposits: Record<string, number> = {};
    stats.customers.forEach(customer => {
        if (customer.deposit_balances) {
            Object.entries(customer.deposit_balances).forEach(([prodId, count]) => {
                if (Number(count) > 0) { // Müşteride varsa (Pozitif değer)
                    const prodName = stats.stock.find(p => p.id === prodId)?.name || 'Bilinmeyen Ürün';
                    marketDeposits[prodName] = (marketDeposits[prodName] || 0) + Number(count);
                }
            });
        }
    });

    const todayRevenue = stats.transactions
        .filter(t =>
            new Date(t.date).toDateString() === new Date().toDateString() &&
            t.type === 'CustomerOp' // Sadece müşteri satışları cirodur, fabrika girişi değil
        )
        .reduce((acc, t) => acc + t.total_amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Genel Bakış</h2>
                    <p className="text-gray-500 mt-1">İşletmenizin anlık durumu ve operasyon özeti.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="ghost" onClick={handleBackup} title="Verileri İndir" className="text-gray-600 border border-gray-200 bg-white hover:bg-gray-50">
                        <Download size={18} className="mr-2" />
                        Yedekle
                    </Button>
                    <Button onClick={() => onNavigate('transactions')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        + Hızlı İşlem
                    </Button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Bayi</p>
                        <p className="text-xl font-bold text-gray-900">{stats.customers.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Bugünkü Ciro</p>
                        <p className="text-xl font-bold text-gray-900">₺{todayRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Ürün</p>
                        <p className="text-xl font-bold text-gray-900">{stats.stock.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Alacak</p>
                        <p className="text-xl font-bold text-gray-900">₺{totalReceivables.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Stock & Deposits */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Depo Stok Kartı */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Package size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Depo Stok</h3>
                                </div>
                                <button onClick={() => onNavigate('inventory')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Tümü →</button>
                            </div>

                            <div className="flex-1 overflow-auto max-h-60 pr-2 space-y-3 custom-scrollbar">
                                {stats.stock.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">Ürün bulunamadı.</p>
                                ) : (
                                    stats.stock.map(product => (
                                        <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="font-medium text-gray-700 text-sm">{product.name}</span>
                                            <span className={`font-bold px-2 py-1 rounded text-xs ${product.stock <= 10 ? 'bg-red-100 text-red-700' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                                {product.stock} Adet
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Piyasa Depozito Kartı */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <Truck size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Piyasadaki Depozitolar</h3>
                                </div>
                                <button onClick={() => onNavigate('customers')} className="text-xs text-orange-600 hover:text-orange-800 font-medium">Detay →</button>
                            </div>

                            <div className="flex-1 overflow-auto max-h-60 pr-2 space-y-3 custom-scrollbar">
                                {Object.keys(marketDeposits).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                                        <p>Piyasada emanet ürün yok.</p>
                                    </div>
                                ) : (
                                    Object.entries(marketDeposits).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                                            <span className="font-medium text-gray-700 text-sm">{name}</span>
                                            <span className="font-bold text-orange-700 bg-white px-2 py-1 rounded text-xs shadow-sm border border-orange-100">
                                                {count} Adet
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Son İşlem Hareketleri</h3>
                            <Button variant="ghost" size="sm" onClick={() => onNavigate('reports')} className="text-gray-500">Tüm Raporlar</Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Tarih</th>
                                        <th className="px-6 py-3">Cari / Müşteri</th>
                                        <th className="px-6 py-3">İşlem</th>
                                        <th className="px-6 py-3 text-right">Tutar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.transactions.slice(0, 5).map((t) => {
                                        const customerName = t.customer_id
                                            ? (stats.customers.find(c => c.id === t.customer_id)?.name || 'Bilinmeyen')
                                            : 'Stok Girişi';

                                        const isSale = t.type === 'CustomerOp' && t.total_amount > 0;

                                        return (
                                            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(t.date).toLocaleDateString()}
                                                    <span className="block text-xs text-gray-400">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${t.customer_id ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                                        <span className="font-medium text-gray-900">{customerName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {t.items?.length || 0} Kalem
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {isSale ? (
                                                        <span className="text-emerald-600 font-bold">
                                                            +₺{t.total_amount.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {stats.transactions.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    Henüz bir işlem kaydı bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Financial Summary */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 h-fit sticky top-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Wallet size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Finansal Özet</h3>
                            <p className="text-xs text-slate-400">Genel Durum</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Toplam Alacak (Cari)</p>
                            <p className="text-4xl font-bold tracking-tight">₺{totalReceivables.toLocaleString()}</p>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-300">Bugünkü Ciro</span>
                                <span className="text-emerald-400 font-bold">+₺{todayRevenue.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Hızlı İşlemler</h4>
                            <div className="space-y-2">
                                <button onClick={() => onNavigate('transactions')} className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                    <ArrowUpRight size={16} className="text-emerald-400" />
                                    Yeni Satış Gir
                                </button>
                                <button onClick={() => onNavigate('customers')} className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2">
                                    <Users size={16} className="text-blue-400" />
                                    Müşteri Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
