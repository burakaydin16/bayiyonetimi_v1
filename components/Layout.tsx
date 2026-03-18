import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ArrowRightLeft, PieChart, Droplets, Settings, LogOut, PlusCircle, ShoppingCart, Truck, UserPlus, PackagePlus, ChevronDown } from 'lucide-react';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = authService.getUser();
  const isAdmin = user?.role === 'Admin' || user?.permissions === '*';

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Envanter', icon: Package },
    { path: '/customers', label: 'Cari Hesaplar', icon: Users },
    { path: '/transactions', label: 'İşlemler', icon: ArrowRightLeft },
    { path: '/reports', label: 'Raporlar', icon: PieChart },
  ];

  const quickActions = [
    { label: 'Satış Yap', icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/transactions?mode=CustomerOp' },
    { label: 'Stok Girişi', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/transactions?mode=FactoryOp' },
    { label: 'Yeni Ürün', icon: PackagePlus, color: 'text-blue-600', bg: 'bg-blue-50', path: '/inventory?action=new' },
    { label: 'Cari Ekle', icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50', path: '/customers?action=new' },
  ];

  const tenantName = localStorage.getItem('tenantName') || 'Firma';
  const tenantRef = localStorage.getItem('tenantRef') || '--';
  const logoUrl = localStorage.getItem('logoUrl');
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const isPathActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

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
      <header className="h-20 bg-[#F5F5F7] border-b border-[#E5E5E7] sticky top-0 z-50 px-6 md:px-10 flex items-center justify-between shadow-sm">
        {/* Left: Brand & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#0071E3] flex items-center justify-center shadow-lg shadow-blue-200/50">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-[120px]">
              <h1 className="font-bold text-[17px] tracking-tight leading-none mb-1 text-slate-800">{tenantName}</h1>
              <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest whitespace-nowrap">ID: {tenantRef}</span>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
            {navItems.map((item) => {
              const active = isPathActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 text-[14px] font-semibold ${active
                    ? 'bg-white text-[#0071E3] shadow-sm ring-1 ring-black/5'
                    : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/50'
                    }`}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Quick Actions Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle size={18} />
              <span>Hızlı İşlemler</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isQuickActionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isQuickActionsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsQuickActionsOpen(false)}></div>
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-[#E5E5E7] py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-[#F5F5F7] mb-1">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Kısayollar</p>
                  </div>
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(action.path);
                        setIsQuickActionsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all text-[14px] font-semibold group"
                    >
                      <div className={`p-1.5 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon size={18} />
                      </div>
                      {action.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

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
                      onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
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
            {navItems.map((item) => {
              const active = isPathActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl text-[17px] font-bold transition-all ${active ? 'bg-[#F5F5F7] text-[#0071E3]' : 'text-[#86868B] hover:bg-gray-50'}`}
                >
                  <item.icon size={22} />
                  {item.label}
                </Link>
              );
            })}
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