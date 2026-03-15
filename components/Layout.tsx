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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Envanter', icon: Package },
    { id: 'customers', label: 'Cari Hesaplar', icon: Users },
    { id: 'transactions', label: 'İşlemler', icon: ArrowRightLeft },
    { id: 'reports', label: 'Raporlar', icon: PieChart },
  ];

  const tenantName = localStorage.getItem('tenantName') || 'Firma';
  const tenantRef = localStorage.getItem('tenantRef') || '--';
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#FBFBFE] flex font-sans text-[#1D1D1F]">
      {/* Sidebar - Clean Light Aesthetic */}
      <aside
        className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white flex-shrink-0 hidden md:flex flex-col border-r border-[#E5E5E7] transition-all duration-400 ease-in-out relative z-50`}
      >
        {/* Header Area */}
        <div className="h-20 flex items-center px-6 border-b border-[#F5F5F7]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[36px] h-9 bg-[#0071E3] rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-[17px] tracking-tight whitespace-nowrap animate-in fade-in duration-500">
                {tenantName}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center h-11 rounded-xl transition-all duration-200 group ${currentPage === item.id
                ? 'bg-[#F5F5F7] text-[#0071E3]'
                : 'text-[#86868B] hover:bg-[#FBFBFE] hover:text-[#1D1D1F]'
                }`}
            >
              <div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-full' : 'w-12 ml-1'}`}>
                <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 2} />
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-[14px] font-medium tracking-wide animate-in slide-in-from-left-2 duration-300`}>
                  {item.label}
                </span>
              )}
              {currentPage === item.id && !isSidebarCollapsed && (
                <div className="ml-auto mr-3 w-1.5 h-1.5 rounded-full bg-[#0071E3]"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer / Collapse Toggle */}
        <div className="p-4 border-t border-[#F5F5F7]">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full h-10 flex items-center justify-center text-[#86868B] hover:bg-[#F5F5F7] rounded-xl transition-all"
            title={isSidebarCollapsed ? "Genişlet" : "Daralt"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2 text-xs font-medium"><ChevronLeft size={18} /> Daralt</div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Navbar */}
        <header className="h-20 bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8 border-b border-[#E5E5E7]/50">
          <div className="flex items-center gap-4">
            <div className="bg-[#F5F5F7] px-3 py-1.5 rounded-full">
              <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest">
                ID: {tenantRef}
              </span>
            </div>
            <h2 className="text-[20px] font-semibold text-[#1D1D1F] tracking-tight">
              {navItems.find(n => n.id === currentPage)?.label || 'Genel Bakış'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-[#E5E5E7]"></div>

            <div className="relative">
              <button
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-[#F5F5F7] transition-all"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-9 h-9 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                  {userInitial}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[13px] font-semibold leading-none">{user?.email?.split('@')[0]}</p>
                  <p className="text-[11px] text-[#86868B] font-medium mt-0.5">{user?.role}</p>
                </div>
              </button>

              {/* Minimal Profile Dropdown */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5E5E7] py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-[#F5F5F7]">
                      <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest mb-1">Hesap</p>
                      <p className="text-[14px] font-medium text-[#1D1D1F] truncate">{user?.email}</p>
                    </div>

                    <div className="p-1.5">
                      <button
                        onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-all text-[14px] font-medium"
                      >
                        <Settings size={18} className="text-[#86868B]" />
                        Ayarlar
                      </button>

                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[#FF3B30] hover:bg-[#FFF2F1] rounded-xl transition-all text-[14px] font-medium"
                      >
                        <LogOut size={18} />
                        Güvenli Çıkış
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-5 h-16 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0071E3] rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">{tenantName}</span>
          </div>
          <button onClick={onLogout} className="text-[#FF3B30] text-xs font-bold px-3 py-1.5 bg-[#FFF2F1] rounded-lg">Çıkış</button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-10 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};