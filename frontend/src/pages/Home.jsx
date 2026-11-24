import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { formatImageUrl } from '../services/apiClient';
import './Home.css';

// Función para convertir texto en slug limpio para URL
const toSlug = (text = '') =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Función para normalizar texto
const normalizeText = (text = '') =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// Imagen de respaldo si una categoría no tiene imagen_url en la BD
const getCategoryFallbackImage = (nombre = '') => {
  const norm = normalizeText(nombre);
  if (norm.includes('sala') || norm.includes('sofa') || norm.includes('sillon')) {
    return 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/sillon.jpeg';
  }
  if (norm.includes('comedor') || norm.includes('mesa') || norm.includes('silla')) {
    return 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/comedor.png';
  }
  if (norm.includes('modulo') || norm.includes('tv') || norm.includes('entretenimiento')) {
    return 'https://mi-bucket-php-2004.s3.us-east-2.amazonaws.com/panel.jpeg';
  }
  if (norm.includes('dormitorio') || norm.includes('cama')) {
    return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80';
  }
  if (norm.includes('decoracion')) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
};

export default function Home({ user, onLogout, onNavigate }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías y productos directamente desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          categoriaService.listar(),
          productoService.listar({ soloActivos: 1 })
        ]);
        setCategorias(catData || []);
        setProductos(prodData || []);
      } catch (err) {
        console.error('Error al cargar datos en inicio:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeItem="inicio"
      />

      {/* Slider / Carrusel de Fotos a Pantalla Completa */}
      <HeroSlider />

      {/* Sección de Categorías dinámicas 100% desde la base de datos */}
      <section className="categories-showcase-section">
        <div className="showcase-header">
          <span className="showcase-tag">ESPACIOS SCALA</span>
          <h2 className="showcase-title">Nuestras Categorías</h2>
          <p className="showcase-subtitle">
            Selecciona una categoría para ver los modelos y diseños disponibles:
          </p>
        </div>

        <div className="categories-cards-grid">
          {categorias.map((cat) => {
            const count = cat.total_productos !== undefined ? cat.total_productos : 0;
            const imgSrc = cat.url_imagen || cat.imagen_url || getCategoryFallbackImage(cat.nombre);

            // Redireccionar a la ruta con el slug de la categoría
            const handleCategoryClick = () => {
              const slug = cat.slug || toSlug(cat.nombre);
              onNavigate && onNavigate('categoria', slug);
            };

            return (
              <div
                key={cat.id_categoria}
                className="category-feature-card"
                onClick={handleCategoryClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCategoryClick();
                }}
              >
                <div className="cat-card-img-wrapper">
                  <img
                    src={imgSrc}
                    alt={cat.nombre}
                    className="cat-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = getCategoryFallbackImage(cat.nombre);
                    }}
                  />
                  <span className="cat-card-overlay-badge">Explorar Colección</span>
                </div>
                <div className="cat-card-info">
                  <h3 className="cat-card-title">{cat.nombre}</h3>
                  <p className="cat-card-desc">
                    {cat.descripcion || 'Diseño y fabricación exclusiva Scala'}
                  </p>
                  <span className="cat-card-counter">
                    {count} {count === 1 ? 'mueble disponible' : 'muebles disponibles'} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sección de Muebles Destacados / Catálogo Reciente */}
      {productos.length > 0 && (
        <section className="categories-showcase-section" style={{ marginTop: '24px' }}>
          <div className="showcase-header">
            <span className="showcase-tag">COLECCIÓN SCALA</span>
            <h2 className="showcase-title">Muebles Destacados</h2>
            <p className="showcase-subtitle">
              Modelos fabricados con materiales seleccionados y diseño contemporáneo
            </p>
          </div>

          <div className="catalog-grid">
            {productos.slice(0, 8).map((p) => {
              const prodImg = formatImageUrl(p.imagen_url || p.url_imagen);
              const handleProdClick = () => {
                onNavigate && onNavigate('producto', p.slug || p.id_muebles || p.id_mueble);
              };

              return (
                <div
                  key={p.id_muebles || p.id_mueble}
                  className="product-card"
                  onClick={handleProdClick}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleProdClick();
                  }}
                >
                  <div className="card-media">
                    <img
                      src={prodImg}
                      alt={p.nombre}
                      className="card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/paguinalogo.jpeg';
                      }}
                    />
                    {p.categoria && (
                      <span className="card-cat-badge">{p.categoria}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{p.nombre}</h3>
                    <p className="card-description">
                      {p.descripcion
                        ? p.descripcion.length > 80
                          ? `${p.descripcion.substring(0, 80)}...`
                          : p.descripcion
                        : 'Mueble de diseño exclusivo con estructura sólida y finos acabados.'}
                    </p>

                    {(p.largo_cm || p.ancho_cm || p.alto_cm) && (
                      <div className="card-dimensions">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        <span>
                          {p.largo_cm ? Math.round(p.largo_cm) : '-'} × {p.ancho_cm ? Math.round(p.ancho_cm) : '-'} × {p.alto_cm ? Math.round(p.alto_cm) : '-'} cm
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

                      <span className="btn-whatsapp-quote">
                        Ver Mueble →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bloque de Garantía y Calidad Scala */}
      <section className="home-guarantee-section">
        <div className="guarantee-inner">
          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3>Madera Seleccionada</h3>
            <p>Estructuras sólidas en madera tornillo, cedro y roble de alta durabilidad.</p>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Garantía de Fábrica</h3>
            <p>Directo de nuestro taller a tu hogar, sin intermediarios ni sobrecostos.</p>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h3>Fabricación a Medida</h3>
            <p>Personalizamos colores, telas, acabados y dimensiones para tu espacio.</p>
          </div>

          <div className="guarantee-card">
            <div className="guarantee-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3>Envíos e Instalación</h3>
            <p>Despacho seguro y armado profesional de tus muebles en tu hogar.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
