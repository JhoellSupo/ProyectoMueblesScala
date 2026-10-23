import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import './App.css';

const isLoginUrl = () => window.location.pathname.toLowerCase() === '/login';

function App() {
  const [view, setView] = useState(() => (isLoginUrl() ? 'login' : 'home'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setView(isLoginUrl() ? 'login' : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView) => {
    setView(newView);
    const newPath = newView === 'login' ? '/login' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    navigateTo('home');
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app">
      {view === 'home' ? (
        <Home user={user} onLogout={handleLogout} onNavigate={navigateTo} />
      ) : (
        <div className="login-wrapper">
          <Login onLogin={handleLogin} onBack={() => navigateTo('home')} />
        </div>
      )}
    </div>
  );
}

export default App;
