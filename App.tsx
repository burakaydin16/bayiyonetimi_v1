import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Settings } from './pages/Settings';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    const init = async () => {
      // 1. URL Parametrelerini Her İhtimale Karşı (Query ve Hash) Yakala
      const getParam = (name: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        let val = urlParams.get(name);
        if (!val && window.location.hash.includes('?')) {
          const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
          val = hashParams.get(name);
        }
        return val;
      };

      const token = getParam('token');
      const tRef = getParam('tenant_ref');
      const tName = getParam('tenant_name');
      const uData = getParam('user');
      const lUrl = getParam('logo_url');

      if (token && tRef) {
        try {
          let parsedUser = null;
          if (uData) {
            try {
              const decoded = decodeURIComponent(uData);
              parsedUser = decoded.startsWith('{') ? JSON.parse(decoded) : decoded;
            } catch (e) {
              parsedUser = uData;
            }
          }

          authService.externalLogin({
            token,
            tenant_ref: tRef,
            tenant_name: tName || '',
            user: parsedUser,
            logo_url: lUrl || undefined
          });

          // URL'yi temizle
          window.history.replaceState({}, document.title, "/");
          setIsAuthenticated(true);
        } catch (err) {
          console.error("LOGIN_DEBUG: Error initializing external session:", err);
        }
      } else {
        setIsAuthenticated(authService.isAuthenticated());
      }
      setIsInit(true);
    };

    init();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAuthView('login');
  };

  if (!isInit) {
    return (
      <div className="min-h-screen bg-[#FBFBFE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071E3]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login
        onLoginSuccess={() => setIsAuthenticated(true)}
        onSwitchToRegister={() => setAuthView('register')}
      />
    ) : (
      <Register
        onRegisterSuccess={() => setAuthView('login')}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard onNavigate={() => { }} />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;