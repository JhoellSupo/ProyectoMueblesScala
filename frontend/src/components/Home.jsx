import './Home.css';

export default function Home({ user, onLogout }) {
  return (
    <div className="home-container">
      <header className="home-header">
        <span className="logo">Scala</span>
        {user && (
          <div className="header-actions">
            <div className="user-nav">
              <span className="user-name">{user.username}</span>
              <button type="button" onClick={onLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="home-main">
        <h1>Bienvenido a Scala</h1>
        <p>Muebles de diseño y confort para tu hogar</p>
      </main>
    </div>
  );
}
