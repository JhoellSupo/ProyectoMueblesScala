import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { authService } from './services/authService';
import './App.css';

const getInitialView = () => {
  const path = window.location.pathname.toLowerCase();
  if (path === '/login') return 'login';
  if (path === '/admin') return 'admin';
  return 'inicio';
};

function App() {
  const [view, setView] = useState(getInitialView);
  const [user, setUser] = useState(() => authService.getStoredUser());

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') setView('login');
      else if (path === '/admin') setView('admin');
      else setView('inicio');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (view === 'admin' && !user) {
      navigateTo('login');
    }
  }, [view, user]);

  const navigateTo = (newView) => {
    setView(newView);
    let newPath = '/';
    if (newView === 'login') newPath = '/login';
    else if (newView === 'admin') newPath = '/admin';
    else if (newView !== 'inicio') newPath = `/#${newView}`;

    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    authService.setStoredUser(userData);
    navigateTo('admin');
  };

  const handleLogout = () => {
    setUser(null);
    authService.logout();
    navigateTo('inicio');
  };

  return (
    <div className="app">
      {view === 'admin' ? (
        <AdminPanel
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      ) : view === 'login' ? (
        <div className="login-wrapper">
          <Login
            onLogin={handleLogin}
            onBack={() => navigateTo('inicio')}
          />
        </div>
      ) : (
        <Home
          currentView={view}
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}

export default App;
