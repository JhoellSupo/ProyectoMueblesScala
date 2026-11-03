export default function AdminHeader({ user, onNavigate, onLogout }) {
  const userName = user?.nombre || user?.username || 'Administrador';
  const initial = userName[0].toUpperCase();

  return (
    <header className="admin-header">
      <div className="admin-header-brand">
        <img src="/LOGO.png" alt="Muebles Scala" className="admin-brand-logo" />
        <div className="admin-title-group">
          <h1 className="admin-main-title">Panel de Administración</h1>
          <span className="admin-badge-role">Gestión de Catálogo e Inventario</span>
        </div>
      </div>

      <div className="admin-header-actions">
        {onNavigate && (
          <button
            type="button"
            className="btn-store-view"
            onClick={() => onNavigate('inicio')}
            title="Ir a la tienda principal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Ver Tienda</span>
          </button>
        )}

        <div className="admin-user-pill">
          <span className="admin-user-avatar">{initial}</span>
          <span className="admin-user-name">{userName}</span>
        </div>

        {onLogout && (
          <button
            type="button"
            className="btn-admin-logout"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Salir</span>
          </button>
        )}
      </div>
    </header>
  );
}

