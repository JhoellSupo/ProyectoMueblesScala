import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productoService } from '../services/productoService';
import './Home.css';

export default function Home({ currentView = 'inicio', user, onLogout, onNavigate }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await productoService.listar({ soloActivos: 1 });
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const getSectionContent = () => {
    switch (currentView) {
      case 'sala':
        return {
          title: 'Juegos de Sala y Sofás',
          subtitle: 'Comodidad, sofisticación y durabilidad pensadas para tu descanso',
          filterFn: (p) => p.categoria?.toLowerCase().includes('sala')
        };
      case 'comedor':
        return {
          title: 'Juegos de Comedor',
          subtitle: 'Momentos inolvidables alrededor de mesas y sillas de finos acabados',
          filterFn: (p) => p.categoria?.toLowerCase().includes('comedor')
        };
      case 'modulos-tv':
        return {
          title: 'Centros de Entretenimiento y Módulos TV',
          subtitle: 'Diseños contemporáneos flotantes con iluminación y estilo',
          filterFn: (p) =>
            p.categoria?.toLowerCase().includes('módulo') ||
            p.categoria?.toLowerCase().includes('modulo') ||
            p.categoria?.toLowerCase().includes('tv')
        };
      case 'inicio':
      default:
        return {
          title: 'Colección Exclusiva Scala',
          subtitle: 'Muebles de diseño y confort elaborados con los más finos materiales',
          filterFn: () => true
        };
    }
  };

  const { title, subtitle, filterFn } = getSectionContent();
  const displayedProducts = productos.filter(filterFn);

  return (
    <div className="home-container">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeItem={currentView}
      />

      {/* Banner de administrador si hay sesión activa */}
      {user && (
        <aside className="admin-status-banner">
          <div className="admin-status-content">
            <span className="admin-status-badge">Modo Administrador</span>
            <span className="admin-status-text">
              Has iniciado sesión como <strong>{user.nombre || user.username}</strong>. Puedes añadir, editar o eliminar muebles en cualquier momento.
            </span>
          </div>
          <button
            type="button"
            className="btn-banner-admin"
            onClick={() => onNavigate && onNavigate('admin')}
          >
            Abrir Panel Admin →
          </button>
        </aside>
      )}

      {/* Hero Section */}
      <section className="catalog-hero">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </section>

      {/* Main Catalog Grid */}
      <main className="home-main">
        {loading ? (
          <div className="catalog-loading">
            <div className="home-spinner" />
            <p>Cargando muebles exclusivos...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="catalog-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>Aún no hay muebles en esta sección</h3>
            <p>Ingresa al panel de administración para agregar productos a esta categoría.</p>
            {user && (
              <button
                type="button"
                className="btn-go-admin-cta"
                onClick={() => onNavigate && onNavigate('admin')}
              >
                + Agregar Mueble en Panel Admin
              </button>
            )}
          </div>
        ) : (
          <div className="catalog-grid">
            {displayedProducts.map((p) => (
              <article key={p.id_mueble} className="product-card">
                <div className="card-media">
                  {p.imagen_url ? (
                    <img
                      src={p.imagen_url}
                      alt={p.nombre}
                      className="card-image"
                      onError={(e) => {
                        e.target.src = '/paguinalogo.jpeg';
                      }}
                    />
                  ) : (
                    <div className="card-image-fallback">
                      <span>Scala Muebles</span>
                    </div>
                  )}
                  <span className="card-cat-badge">{p.categoria || 'Scala'}</span>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{p.nombre}</h3>
                  <p className="card-description">
                    {p.descripcion || 'Mueble fabricado con materiales de primera calidad.'}
                  </p>

                  {(p.largo_cm || p.ancho_cm || p.alto_cm) && (
                    <div className="card-dimensions">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                      <span>
                        {p.largo_cm || '-'} × {p.ancho_cm || '-'} × {p.alto_cm || '-'} cm
                      </span>
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="card-price-box">
                      <span className="price-currency">S/.</span>
                      <span className="price-amount">
                        {Number(p.precio).toLocaleString('es-PE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/51952003883?text=Hola%20Muebles%20Scala,%20deseo%20consultar%20sobre%20el%20mueble:%20${encodeURIComponent(
                        p.nombre
                      )}`}
                      className="btn-whatsapp-quote"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consultar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
