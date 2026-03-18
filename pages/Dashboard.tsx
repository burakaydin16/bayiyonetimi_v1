
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Product, Transaction, Customer } from '../types';
import { Package, Wallet, Download, Truck, ArrowUpRight, ArrowDownLeft, Users, TrendingUp, Eye, X, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        stock: [] as Product[],
        transactions: [] as Transaction[],
        customers: [] as Customer[],
    });

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
            t.type === 'CustomerOp'
        )
        .reduce((acc, t) => acc + t.total_amount, 0);

    const openTransactionDetail = (t: Transaction) => {
        setSelectedTransaction(t);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Genel Durum</h2>
                    <p className="text-slate-500 font-medium mt-1">İşletmenizin anlık performansı ve operasyonel verileri.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="ghost" onClick={handleBackup} className="text-slate-600 border-2 border-slate-200 bg-white hover:bg-slate-50 font-bold px-6">
                        <Download size={18} className="mr-2" />
                        Veri Yedekle
                    </Button>
                </div>
            </div>

            {/* Quick Stats Row - Modern Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Aktif Bayiler', val: stats.customers.length, icon: Users, color: 'blue' },
                    { label: 'Günlük Ciro', val: `₺${todayRevenue.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
                    { label: 'Ürün Çeşidi', val: stats.stock.length, icon: Package, color: 'indigo' },
                    { label: 'Bekleyen Alacak', val: `₺${totalReceivables.toLocaleString()}`, icon: Wallet, color: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Stock & Deposits */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Depo Stok Kartı */}
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-50 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
                                        <Package size={22} />
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900">Depo Stokları</h3>
                                </div>
                                <Link to="/inventory" className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors">Yönet</Link>
                            </div>

                            <div className="flex-1 overflow-auto max-h-64 pr-2 space-y-3 custom-scrollbar">
                                {stats.stock.length === 0 ? (
                                    <p className="text-slate-400 text-sm text-center py-8">Kayıtlı ürün bulunamadı.</p>
                                ) : (
                                    stats.stock.map(product => (
                                        <div key={product.id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:border-slate-200">
                                            <span className="font-bold text-slate-700">{product.name}</span>
                                            <span className={`font-black px-4 py-1.5 rounded-xl text-xs tracking-tight shadow-sm ${product.stock <= 10 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-white text-slate-900 border border-slate-200'}`}>
                                                {product.stock} Adet
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Piyasa Depozito Kartı */}
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-50 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
                                        <Truck size={22} />
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900">Emanet Ürünler</h3>
                                </div>
                                <Link to="/customers" className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-colors">İncele</Link>
                            </div>

                            <div className="flex-1 overflow-auto max-h-64 pr-2 space-y-3 custom-scrollbar">
                                {Object.keys(marketDeposits).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm py-8 text-center">
                                        <p>Şu an piyasada bekleyen<br />açık depozito yok.</p>
                                    </div>
                                ) : (
                                    Object.entries(marketDeposits).map(([name, count]) => (
                                        <div key={name} className="flex justify-between items-center p-4 bg-orange-50/30 rounded-2xl border border-orange-100 transition-colors hover:bg-white hover:border-orange-200">
                                            <span className="font-bold text-slate-700">{name}</span>
                                            <span className="font-black text-orange-700 bg-white px-4 py-1.5 rounded-xl text-xs shadow-sm border border-orange-100">
                                                {count} Adet
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions Table */}
                    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-slate-50 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-black text-lg text-slate-900">Güncel Hareketler</h3>
                            <Link to="/reports" className="text-sm font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">Tüm Geçmiş</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                    <tr>
                                        <th className="px-8 py-4">Tarih / Saat</th>
                                        <th className="px-8 py-4">İşlem Yapılan Cari</th>
                                        <th className="px-8 py-4">İçerik</th>
                                        <th className="px-8 py-4 text-right">Tutar</th>
                                        <th className="px-8 py-4 text-right">Detay</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {stats.transactions.slice(0, 5).map((t) => {
                                        const customerName = t.customer_id
                                            ? (stats.customers.find(c => c.id === t.customer_id)?.name || 'Bilinmeyen')
                                            : 'Stok Girişi';

                                        const isSale = t.type === 'CustomerOp' && t.total_amount > 0;

                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5 text-slate-600">
                                                    <div className="font-bold text-slate-900">{new Date(t.date).toLocaleDateString()}</div>
                                                    <div className="text-[11px] font-bold text-slate-400">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full shadow-sm ${t.customer_id ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-purple-500 ring-4 ring-purple-50'}`}></div>
                                                        <span className="font-black text-slate-800">{customerName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 font-bold text-xs">{t.items?.length || 0} Kalem Ürün</span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {isSale ? (
                                                        <span className="text-emerald-600 font-black text-base">
                                                            +₺{t.total_amount.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 font-bold">---</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => openTransactionDetail(t)}
                                                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                        title="Hareketi İncele"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {stats.transactions.length === 0 && (
                                <div className="p-12 text-center text-slate-400 font-bold">
                                    Henüz hiçbir işlem kaydı oluşturulmadı.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Financial Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200 sticky top-10 overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-white/10 rounded-[20px] backdrop-blur-md border border-white/10 ring-1 ring-white/20 shadow-lg">
                                    <Wallet size={28} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl tracking-tight">Finansal Özet</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">İşletme Bakiyesi</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <p className="text-sm font-bold text-slate-400 mb-2">Toplam Cari Alacak</p>
                                    <p className="text-4xl font-black tracking-tighter text-white">₺{totalReceivables.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-emerald-400">
                                        <TrendingUp size={14} />
                                        <span>Aktif alacak bekleyen cari hesaplar</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 mb-1">Bugünkü Toplam Ciro</p>
                                            <span className="text-2xl font-black text-emerald-400">+₺{todayRevenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3 p-1 ring-1 ring-white/10">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                            style={{ width: '100%' }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 mt-4 italic">
                                        * Ciro hesaplamasına sadece bayi satışları dahildir, fabrika stok girişleri dikkate alınmaz.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Transaction Detail Modal */}
            {isDetailModalOpen && selectedTransaction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/10 animate-in fade-in duration-300" onClick={() => setIsDetailModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        {/* Modal Header - More Compact */}
                        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">İşlem Detayı</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    {new Date(selectedTransaction.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar space-y-5">
                            {/* Compact Customer Info */}
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className={`p-2.5 rounded-xl ${selectedTransaction.customer_id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-800 text-white shadow-md shadow-slate-200'}`}>
                                    {selectedTransaction.customer_id ? <Users size={18} /> : <Package size={18} />}
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">İşlem Sahibi</p>
                                    <p className="font-black text-slate-900 text-sm">
                                        {selectedTransaction.customer_id
                                            ? (stats.customers.find(c => c.id === selectedTransaction.customer_id)?.name || 'Bilinmeyen Müşteri')
                                            : 'Fabrika Stok Girişi'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] px-1">İşlem İçeriği</h4>
                                <div className="space-y-2">
                                    {selectedTransaction.items.map((item, idx) => {
                                        const product = stats.stock.find(p => p.id === item.product_id);
                                        return (
                                            <div key={idx} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${item.item_type === 'Gonderilen' ? 'bg-emerald-50 text-emerald-600' : item.item_type === 'IadeAlinan' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                        {item.item_type === 'Gonderilen' ? <ArrowUpRight size={14} /> : item.item_type === 'IadeAlinan' ? <ArrowDownLeft size={14} /> : <CheckCircle2 size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-[13px]">{product?.name || 'Bilinmeyen Ürün'}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                            {item.item_type === 'Gonderilen' ? 'ÇIKIŞ' : item.item_type === 'IadeAlinan' ? 'İADE' : 'GİRİŞ'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 text-[13px]">{item.quantity} Adet</p>
                                                    {item.unit_price > 0 && (
                                                        <p className="text-[9px] font-bold text-slate-400">₺{item.unit_price.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Compact */}
                        <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Toplam Tutar</p>
                                <p className="text-xl font-black text-slate-900">₺{selectedTransaction.total_amount.toLocaleString()}</p>
                            </div>
                            <Button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-black transition-all"
                            >
                                Kapat
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
