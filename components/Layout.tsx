import React from 'react';
import { LayoutDashboard, Users, Package, ArrowRightLeft, PieChart, Droplets, Settings } from 'lucide-react';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  tenantName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout, tenantName: propTenantName }) => {
  const user = authService.getUser();
  const isAdmin = user?.role === 'Admin' || user?.permissions === '*';

  const navItems = [
    { id: 'dashboard', label: 'Özet Panosu', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stok ve Envanter', icon: Package },
    { id: 'customers', label: 'Bayi ve Cari', icon: Users },
    { id: 'transactions', label: 'Yeni Hareket', icon: ArrowRightLeft },
    { id: 'reports', label: 'Analizler', icon: PieChart },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const tenantName = localStorage.getItem('tenantName') || 'SuTakip';
  const tenantRef = localStorage.getItem('tenantRef') || '--';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800 shadow-2xl">
        {/* Sidebar Header with Premium Gradient */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-water-600/20 to-transparent opacity-50"></div>
          <div className="p-8 pb-10 flex flex-col items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <Droplets className="w-8 h-8 text-water-400" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="font-black text-xl tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 truncate w-56">
                {tenantName}
              </h1>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-water-500/10 border border-water-500/20">
                <span className="text-[10px] font-black text-water-400 uppercase tracking-widest">Premium Partner</span>
              </div>
            </div>
          </div>
          {/* Subtle separator */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${currentPage === item.id
                ? 'bg-gradient-to-r from-water-600 to-water-500 text-white shadow-xl shadow-water-600/20 scale-[1.02]'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={22} className={`${currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-water-400'} transition-colors`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-center gap-2 text-slate-500 group pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Sistem Aktif</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - Desktop */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 hidden md:flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Yönetim Paneli</span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{tenantName}</h2>
            </div>
            <div className="h-10 w-px bg-slate-200 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Referans</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600 border border-slate-200">
                {tenantRef}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-inner">
                <Users className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 leading-none mb-1">{user?.email}</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-water-500"></span>
                  <span className="text-[10px] font-black text-water-600 uppercase tracking-tighter">{user?.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-2xl shadow-lg shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 font-black text-sm uppercase tracking-widest"
            >
              Çıkış
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden bg-white/95 backdrop-blur-md border-b p-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-water-500 p-2 rounded-xl">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg text-slate-800 tracking-tight truncate w-32">{tenantName}</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currentPage}
              onChange={(e) => onNavigate(e.target.value)}
              className="bg-slate-100 border-none rounded-xl px-3 py-2 text-xs font-black text-slate-600 focus:ring-2 focus:ring-water-500/20 outline-none"
            >
              {navItems.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
            <button onClick={onLogout} className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100">
              <span className="text-xs font-black">X</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};