
import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Transaction, Customer, Product } from '../types';
import { Search, Calendar, FileText, User, Filter, ArrowRight, Printer, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Filtreler
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]); // Son 30 gün
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
        const t = await DataService.getTransactions();
        const c = await DataService.getCustomers();
        const p = await DataService.getProducts();
        setTransactions(t);
        setCustomers(c);
        setProducts(p);
    };
    fetchData();
  }, []);

  // Filtreleme Mantığı
  const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date).toISOString().split('T')[0];
      const dateMatch = tDate >= startDate && tDate <= endDate;
      const customerMatch = selectedCustomerId ? t.customer_id === selectedCustomerId : true;
      return dateMatch && customerMatch;
  });

  // Seçili Müşteri Verileri
  const selectedCustomerData = customers.find(c => c.id === selectedCustomerId);

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h2 className="text-2xl font-bold text-gray-900">Raporlar & Hareketler</h2>
               <p className="text-gray-500 text-sm">Detaylı bayi hareketleri ve sevkiyat raporları.</p>
           </div>
           <Button onClick={handlePrint} variant="outline" className="hidden md:flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
               <Printer size={18} />
               Yazdır / PDF
           </Button>
       </div>

       {/* Filtre Alanı */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                   <User size={16} className="text-gray-400" /> Bayi / Müşteri Seçimi
               </label>
               <div className="relative">
                   <select 
                       className="w-full border border-gray-200 rounded-lg p-3 pl-4 outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none transition-all"
                       value={selectedCustomerId}
                       onChange={e => setSelectedCustomerId(e.target.value)}
                   >
                       <option value="">Tüm Hareketleri Listele</option>
                       {customers.map(c => (
                           <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                       ))}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                       <Filter size={16} />
                   </div>
               </div>
           </div>
           
           <div>
               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                   <Calendar size={16} className="text-gray-400" /> Başlangıç Tarihi
               </label>
               <input 
                   type="date" 
                   className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   value={startDate}
                   onChange={e => setStartDate(e.target.value)}
               />
           </div>

           <div>
               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                   <Calendar size={16} className="text-gray-400" /> Bitiş Tarihi
               </label>
               <input 
                   type="date" 
                   className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   value={endDate}
                   onChange={e => setEndDate(e.target.value)}
               />
           </div>
       </div>

       {/* Müşteri seçiliyse Özet Kartı Göster */}
       {selectedCustomerData && (
           <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
               <div className="flex flex-col md:flex-row gap-8">
                   {/* Sol Taraf: Müşteri Bilgisi ve Bakiye */}
                   <div className="flex-1 border-b md:border-b-0 md:border-r border-indigo-100 pb-4 md:pb-0 md:pr-8">
                       <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                               <User size={24} />
                           </div>
                           <div>
                               <h3 className="text-xl font-bold text-gray-900">{selectedCustomerData.name}</h3>
                               <p className="text-indigo-600 text-sm font-medium">{selectedCustomerData.type}</p>
                           </div>
                       </div>
                       <p className="text-gray-500 text-sm mb-6 pl-[52px]">{selectedCustomerData.phone || 'Telefon yok'}</p>
                       
                       <div className="bg-white rounded-xl p-4 border border-indigo-50 shadow-sm inline-block w-full">
                           <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Güncel Nakit Bakiyesi</p>
                           <p className={`text-2xl font-bold ${selectedCustomerData.cash_balance > 0 ? 'text-red-600' : selectedCustomerData.cash_balance < 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                               {selectedCustomerData.cash_balance > 0 ? `Borçlu: ₺${selectedCustomerData.cash_balance.toLocaleString()}` : selectedCustomerData.cash_balance < 0 ? `Alacaklı: ₺${Math.abs(selectedCustomerData.cash_balance).toLocaleString()}` : '₺0'}
                           </p>
                       </div>
                   </div>

                   {/* Sağ Taraf: Elindeki Depozitolar */}
                   <div className="flex-[2]">
                       <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                           <FileText size={16} /> Müşterideki Depozito Durumu
                       </h4>
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                           {selectedCustomerData.deposit_balances && Object.entries(selectedCustomerData.deposit_balances).map(([prodId, count]) => {
                               if(Number(count) === 0) return null;
                               const prod = products.find(p => p.id === prodId);
                               return (
                                   <div key={prodId} className="bg-white p-3 rounded-lg border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                                       <p className="text-xs text-gray-500 truncate mb-1 font-medium">{prod?.name}</p>
                                       <p className={`font-bold text-lg ${Number(count) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                           {Number(count) > 0 ? `${count}` : `${Math.abs(Number(count))}`}
                                           <span className="text-xs font-normal text-gray-400 ml-1">Adet</span>
                                       </p>
                                       <p className={`text-[10px] font-medium ${Number(count) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                           {Number(count) > 0 ? 'Bizde (Borçlu)' : 'Onda (Alacaklı)'}
                                       </p>
                                   </div>
                               );
                           })}
                           {(!selectedCustomerData.deposit_balances || Object.values(selectedCustomerData.deposit_balances).every(v => v === 0)) && (
                               <div className="col-span-full text-center py-8 bg-white/50 rounded-lg border border-dashed border-indigo-200">
                                   <p className="text-sm text-indigo-400">Bu müşteride aktif depozito hareketi bulunmuyor.</p>
                               </div>
                           )}
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Hareket Tablosu */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                   <Filter size={20} className="text-indigo-500" />
                   Hareket Dökümü
               </h3>
               <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                   {filteredTransactions.length} Kayıt Listeleniyor
               </span>
           </div>
           
           <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider text-xs">
                       <tr>
                           <th className="px-6 py-4">Tarih / Saat</th>
                           <th className="px-6 py-4">Müşteri / İşlem Tipi</th>
                           <th className="px-6 py-4">İşlem Detayları</th>
                           <th className="px-6 py-4 text-right">Toplam Tutar</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       {filteredTransactions.length === 0 ? (
                           <tr>
                               <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                                   <div className="flex flex-col items-center gap-2">
                                       <Search size={32} className="text-gray-200" />
                                       <p>Seçilen kriterlere uygun hareket bulunamadı.</p>
                                   </div>
                               </td>
                           </tr>
                       ) : (
                           filteredTransactions.map(t => {
                               const cName = t.customer_id ? customers.find(c => c.id === t.customer_id)?.name : 'Stok Girişi (Fabrika)';
                               const isFactory = !t.customer_id;
                               
                               return (
                                   <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                                       <td className="px-6 py-4 whitespace-nowrap">
                                           <div className="font-medium text-gray-900">{new Date(t.date).toLocaleDateString('tr-TR')}</div>
                                           <div className="text-xs text-gray-400">{new Date(t.date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                                       </td>
                                       <td className="px-6 py-4">
                                           <div className={`font-medium ${isFactory ? 'text-orange-600' : 'text-gray-900'}`}>
                                               {cName}
                                           </div>
                                           {isFactory && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Depo Girişi</span>}
                                       </td>
                                       <td className="px-6 py-4">
                                           <div className="space-y-1.5">
                                               {t.items.map((item, idx) => {
                                                   const pName = products.find(p => p.id === item.product_id)?.name;
                                                   return (
                                                       <div key={idx} className="flex items-center gap-2 text-xs">
                                                           <ArrowRight size={12} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                                                           <span className="text-gray-700 font-medium w-32 truncate" title={pName}>{pName}</span>
                                                           <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.quantity} Adet</span>
                                                           <span className={`px-2 py-0.5 rounded font-medium ${
                                                               item.item_type === 'Gonderilen' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                                                               item.item_type === 'IadeAlinan' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                                                           }`}>
                                                               {item.item_type === 'Gonderilen' ? 'Çıkış' : item.item_type === 'IadeAlinan' ? 'İade' : 'Giriş'}
                                                           </span>
                                                       </div>
                                                   );
                                               })}
                                           </div>
                                       </td>
                                       <td className="px-6 py-4 text-right font-bold text-gray-800">
                                           {t.total_amount > 0 ? `₺${t.total_amount.toLocaleString()}` : '-'}
                                       </td>
                                   </tr>
                               );
                           })
                       )}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  );
};
