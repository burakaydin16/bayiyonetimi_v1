import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Package, ArrowRightLeft, PieChart, Droplets, Settings, ChevronLeft, ChevronRight, LogOut, User as UserIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  tenantName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, onLogout, tenantName: propTenantName }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const logoUrl = localStorage.getItem('logoUrl');
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    if (logoUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = logoUrl;
      }
    }
  }, [logoUrl]);

  return (
    <div className="min-h-screen bg-[#FBFBFE] flex flex-col font-sans text-[#1D1D1F]">
      {/* Universal Top Navigation */}
      <header className="h-20 bg-white border-b border-[#E5E5E7] sticky top-0 z-50 px-6 md:px-10 flex items-center justify-between shadow-sm">
        {/* Left: Brand & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#0071E3] flex items-center justify-center shadow-lg shadow-blue-200/50">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-[17px] tracking-tight leading-none mb-1">{tenantName}</h1>
              <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">ID: {tenantRef}</span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 text-[14px] font-semibold ${currentPage === item.id
                  ? 'bg-white text-[#0071E3] shadow-sm ring-1 ring-black/5'
                  : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/50'
                  }`}
              >
                <item.icon size={18} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-px bg-[#E5E5E7] hidden sm:block mx-1"></div>

          <div className="relative">
            <button
              className="flex items-center gap-3 p-1 rounded-full hover:bg-[#F5F5F7] transition-all"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold leading-none">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-[#86868B] font-bold mt-1 uppercase tracking-tighter">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white text-[13px] font-bold ring-2 ring-white shadow-md">
                {userInitial}
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-[#E5E5E7] py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 border-b border-[#F5F5F7]">
                    <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-widest mb-1">Hesap</p>
                    <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">{user?.email}</p>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-xl transition-all text-[14px] font-semibold"
                    >
                      <Settings size={18} className="text-[#86868B]" />
                      Ayarlar
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[#FF3B30] hover:bg-[#FFF2F1] rounded-xl transition-all text-[14px] font-semibold"
                    >
                      <LogOut size={18} />
                      Güvenli Çıkış
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <span className="text-xl">✕</span> : <span className="text-2xl">☰</span>}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-6 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-4 p-4 rounded-xl text-[17px] font-bold transition-all ${currentPage === item.id ? 'bg-[#F5F5F7] text-[#0071E3]' : 'text-[#86868B] hover:bg-gray-50'}`}
              >
                <item.icon size={22} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#FBFBFE]">
        <div className="p-6 md:p-10 max-w-[1440px] mx-auto animate-in fade-in duration-700">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};