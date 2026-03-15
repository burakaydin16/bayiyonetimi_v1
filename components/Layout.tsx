import React, { useState } from 'react';
import { LayoutDashboard, Users, Package, ArrowRightLeft, PieChart, Droplets, Settings, ChevronLeft, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  tenantName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout, tenantName: propTenantName }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = authService.getUser();
  const isAdmin = user?.role === 'Admin' || user?.permissions === '*';

  const navItems = [
    { id: 'dashboard', label: 'Özet Panosu', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stok ve Envanter', icon: Package },
    { id: 'customers', label: 'Bayi ve Cari', icon: Users },
    { id: 'transactions', label: 'Yeni Hareket', icon: ArrowRightLeft },
    { id: 'reports', label: 'Analizler', icon: PieChart },
  ];

  const tenantName = localStorage.getItem('tenantName') || 'Firma Adı';
  const tenantRef = localStorage.getItem('tenantRef') || '--';
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-blue-900/30 shadow-2xl transition-all duration-300 relative`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-24 bg-blue-600 text-white p-1 rounded-full shadow-lg z-50 hover:bg-blue-500 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sidebar Header */}
        <div className="p-6 pb-8 flex items-center justify-center border-b border-white/5 bg-black/10">
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-br from-blue-400 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 ${isSidebarCollapsed ? 'scale-110' : ''}`}>
              <Droplets className="w-6 h-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Yönetim</span>
                <span className="font-black text-lg tracking-tight leading-none">{tenantName}</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-5'} py-3.5 rounded-2xl transition-all duration-300 group ${currentPage === item.id
                ? 'bg-blue-600/90 text-white shadow-xl shadow-blue-600/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <item.icon size={22} className={`${currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
              {!isSidebarCollapsed && (
                <span className="font-bold text-sm ml-4 tracking-wide animate-in slide-in-from-left-2 duration-300">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-center gap-2 text-blue-400/60">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest ">Portal v1.0</span>}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar - Desktop */}
        <header className="h-20 bg-white shadow-sm border-b border-slate-200 hidden md:flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
              {tenantName}
            </h2>
            <div className="px-3 py-1 bg-blue-50 rounded-lg text-xs font-black text-blue-600 border border-blue-100 uppercase tracking-wider">
              Ref: {tenantRef}
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-black text-slate-900 leading-none mb-1">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user?.role}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                {userInitial}
              </div>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                ></div>
                <div className="absolute right-0 top-16 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <UserIcon size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{user?.email}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{user?.role}</p>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl transition-all duration-200 group"
                    >
                      <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                      <span className="text-sm font-bold tracking-tight">Hesap Ayarları</span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-bold tracking-tight">Güvenli Çıkış</span>
                    </button>
                  </div>
                </div>
              </>
            )}
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