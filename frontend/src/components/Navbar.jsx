import { useState } from 'react';
import './Navbar.css';

export default function Navbar({
  user = null,
  onLogout = null,
  onNavigate = null,
  activeItem = 'inicio'
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, itemKey) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(itemKey);
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { key: 'inicio', label: 'Inicio', href: '/' },
    { key: 'sala', label: 'Sala', href: '#sala' },
    { key: 'comedor', label: 'Comedor', href: '#comedor' },
    { key: 'modulos-tv', label: 'Módulos TV', href: '#modulostv' },
  ];

  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Logo */}
        <a
          href="/"
          className="header-logo-link"
          onClick={(e) => handleLinkClick(e, 'inicio', '/')}
          aria-label="Ir a Inicio - Muebles Scala"
        >
          <img src="/LOGO.png" alt="Muebles Scala" className="header-logo" />
        </a>

        {/* Botón hamburguesa móvil */}
        <button
          type="button"
          className={`btn-mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Navegación */}
        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.key} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activeItem === item.key ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, item.key, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <a
                href="https://maps.app.goo.gl/jxit5ffiuHsQ32Jj8"
                className="nav-link nav-link-location"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="location-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Ubicación</span>
              </a>
            </li>
          </ul>

          {/* Solo si hay sesión de administrador activa */}
          {user && (
            <div className="header-user-actions">
              <div className="user-profile">
                <span className="user-greeting">
                  <svg
                    className="user-avatar-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{user.username}</span>
                </span>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="btn-nav-logout"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
