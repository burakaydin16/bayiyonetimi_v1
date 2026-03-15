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

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout, tenantName }) => {
  const user = authService.getUser();
  const isAdmin = user?.role === 'Admin' || user?.permissions === '*';

  const navItems = [
    { id: 'dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stok & Ürünler', icon: Package },
    { id: 'customers', label: 'Bayiler & Cari', icon: Users },
    { id: 'transactions', label: 'Hareket Ekle', icon: ArrowRightLeft },
    { id: 'reports', label: 'Raporlar', icon: PieChart },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  const displayTenantName = localStorage.getItem('tenantName') || 'SuTakip';
  const displayTenantRef = localStorage.getItem('tenantRef') || '--';

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 bg-slate-900/50">
          <div className="bg-water-500 p-2 rounded-lg shadow-lg shadow-water-500/20">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight truncate w-32">{displayTenantName}</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">SuTakip v1</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentPage === item.id
                ? 'bg-water-600 text-white shadow-lg shadow-water-900/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <p className="text-[10px] text-slate-500 text-center font-medium">© 2024 SuTakip Sistemleri</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - Desktop */}
        <header className="h-16 bg-white border-b border-gray-100 hidden md:flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">{displayTenantName}</h2>
            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono font-bold text-gray-500">
              REF: {displayTenantRef}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user?.email}</span>
              <span className="text-[10px] font-bold text-water-600 uppercase tracking-tighter">{user?.role}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all text-sm font-bold"
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-water-600" />
            <span className="font-bold text-sm truncate w-24">{displayTenantName}</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={currentPage}
              onChange={(e) => onNavigate(e.target.value)}
              className="bg-gray-100 border-none rounded-lg p-2 text-xs font-bold"
            >
              {navItems.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
            <button onClick={onLogout} className="p-2 bg-red-50 text-red-600 rounded-lg">
              <span className="text-xs font-bold">Çıkış</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};