import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import CategoriaPage from './pages/CategoriaPage';
import ProductoDetalle from './pages/ProductoDetalle';
import { authService } from './services/authService';
import './App.css';

const parseCurrentRoute = () => {
  const path = window.location.pathname.toLowerCase();
  if (path === '/login') return { view: 'login' };
  if (path === '/admin') return { view: 'admin' };

  // Ruta dinámica de producto /productos/:slug (o /producto/:slug)
  const prodMatch = path.match(/^\/productos?\/([a-z0-9-]+)/);
  if (prodMatch) {
    return { view: 'producto', productParam: prodMatch[1] };
  }

  // Ruta dinámica de categoría /categorias/:slug (o /categoria/:slug)
  const catMatch = path.match(/^\/categorias?\/([a-z0-9-]+)/);
  if (catMatch) {
    return { view: 'categoria', categoryParam: catMatch[1] };
  }

  // Rutas directas de conveniencia: /sala, /comedor, /modulos-tv
  if (path === '/sala' || path.startsWith('/sala')) {
    return { view: 'categoria', categoryParam: 'sala' };
  }
  if (path === '/comedor' || path.startsWith('/comedor')) {
    return { view: 'categoria', categoryParam: 'comedor' };
  }
  if (path === '/modulos-tv' || path === '/modulostv' || path.startsWith('/modulos')) {
    return { view: 'categoria', categoryParam: 'modulos-tv' };
  }

  return { view: 'inicio' };
};

function App() {
  const [route, setRoute] = useState(parseCurrentRoute);
  const [user, setUser] = useState(() => authService.getStoredUser());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (route.view === 'admin' && !user) {
      navigateTo('login');
    }
  }, [route.view, user]);

  const navigateTo = (newView, param = null) => {
    let newPath = '/';
    let targetView = newView;
    let targetCatParam = null;
    let targetProdParam = null;

    if (newView === 'login') {
      newPath = '/login';
    } else if (newView === 'admin') {
      newPath = '/admin';
    } else if (newView === 'producto' || newView === 'productos') {
      targetView = 'producto';
      targetProdParam = String(param).toLowerCase();
      newPath = `/productos/${targetProdParam}`;
    } else if (newView === 'categoria' || newView === 'categorias') {
      targetView = 'categoria';
      targetCatParam = String(param).toLowerCase();
      newPath = `/categorias/${targetCatParam}`;
    } else if (newView === 'sala' || newView === 'comedor' || newView === 'modulos-tv') {
      targetView = 'categoria';
      targetCatParam = newView;
      newPath = `/categorias/${newView}`;
    } else if (typeof newView === 'string' && newView.startsWith('cat-')) {
      targetView = 'categoria';
      targetCatParam = newView.replace('cat-', '');
      newPath = `/categorias/${targetCatParam}`;
    } else if (newView !== 'inicio') {
      newPath = `/#${newView}`;
    }

    setRoute({ view: targetView, categoryParam: targetCatParam, productParam: targetProdParam });

    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {route.view === 'admin' ? (
        <AdminPanel
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      ) : route.view === 'login' ? (
        <div className="login-wrapper">
          <Login
            onLogin={handleLogin}
            onBack={() => navigateTo('inicio')}
          />
        </div>
      ) : route.view === 'producto' && route.productParam ? (
        <ProductoDetalle
          key={route.productParam}
          productIdentifier={route.productParam}
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      ) : route.view === 'categoria' && route.categoryParam ? (
        <CategoriaPage
          key={route.categoryParam}
          categoryIdentifier={route.categoryParam}
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      ) : (
        <Home
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      )}
    </div>
  );
}

export default App;
