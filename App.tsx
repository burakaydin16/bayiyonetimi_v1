import React, { useState, useEffect } from 'react';
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
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    // Check if token still exists on mount
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAuthView('login');
  };

  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    } else {
      return (
        <Register
          onRegisterSuccess={() => setAuthView('login')}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} />;
      case 'inventory':
        return <Inventory />;
      case 'customers':
        return <Customers />;
      case 'transactions':
        return <Transactions />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      onLogout={handleLogout}
      tenantName={localStorage.getItem('tenantName') || ''}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;