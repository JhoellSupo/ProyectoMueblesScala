import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { formatImageUrl } from '../services/apiClient';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import './CategoryPage.css';
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

// Imagen de respaldo por si la categoría no tiene imagen_url asignada
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

/**
 * Plantilla única y reutilizable para cualquier categoría del catálogo
 * Soporta búsqueda por nombre limpio en URL (ej. /categorias/comedor) o por ID.
 */
export default function CategoriaPage({ categoryIdentifier, user, onLogout, onNavigate }) {
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allCats = await categoriaService.listar();
        const identSlug = toSlug(categoryIdentifier);

        // Encontrar la categoría comparando por slug de BD, slug calculado o ID
        const found = (allCats || []).find((c) => {
          return (
            c.slug === identSlug ||
            toSlug(c.nombre) === identSlug ||
            String(c.id_categorias || c.id_categoria) === String(categoryIdentifier) ||
            normalizeText(c.nombre) === normalizeText(categoryIdentifier)
          );
        });

        if (found) {
          setCategoria(found);
          const catId = found.id_categorias || found.id_categoria;
          const prods = await productoService.listar({
            categoria: catId,
            soloActivos: 1
          });
          setProductos(prods || []);
        } else {
          setCategoria(null);
          setProductos([]);
        }
      } catch (err) {
        console.error('Error al cargar datos de la categoría:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryIdentifier) {
      fetchData();
    }
  }, [categoryIdentifier]);

  const catName = categoria?.nombre || 'Categoría';
  const catDesc =
    categoria?.descripcion ||
    'Modelos y diseños exclusivos fabricados con materiales de primera calidad para tu hogar.';
  const catImage = categoria?.imagen_url || getCategoryFallbackImage(categoria?.nombre);

  // Determinar identificador activo para el Navbar
  const getActiveNavItem = () => {
    const slug = toSlug(catName);
    if (slug.includes('sala')) return 'sala';
    if (slug.includes('comedor')) return 'comedor';
    if (slug.includes('modulo') || slug.includes('tv')) return 'modulos-tv';
    return slug;
  };

  return (
    <div className="category-page-container">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeItem={getActiveNavItem()}
      />

      {/* Hero Banner Dinámico de la Categoría */}
      <section
        className="category-page-hero"
        style={{
          background: `linear-gradient(135deg, rgba(2, 47, 48, 0.92) 0%, rgba(2, 64, 66, 0.85) 100%), url(${catImage}) center/cover no-repeat`
        }}
      >
        <div className="category-hero-inner">
          <nav className="category-breadcrumb" aria-label="Migas de pan">
            <button type="button" onClick={() => onNavigate && onNavigate('inicio')}>
              Inicio
            </button>
            <span className="breadcrumb-separator">/</span>
            <span>{catName}</span>
          </nav>

          <h1 className="category-hero-title">{catName}</h1>
          <p className="category-hero-subtitle">{catDesc}</p>
          <span className="category-hero-badge">
            {productos.length} {productos.length === 1 ? 'modelo exclusivo' : 'modelos exclusivos'}
          </span>
        </div>
      </section>

      {/* Contenido Principal */}
      <main className="category-main-content">
        {/* Barra de Beneficios y Garantía Scala */}
        <div className="category-benefits-bar">
          <div className="benefit-item">
            <div className="benefit-icon">🪵</div>
            <div className="benefit-text">
              <h4>Madera Seleccionada</h4>
              <p>Estructuras sólidas y duraderas</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <div className="benefit-text">
              <h4>Garantía de Fábrica</h4>
              <p>Calidad garantizada sin intermediarios</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📐</div>
            <div className="benefit-text">
              <h4>A Tu Medida</h4>
              <p>Personaliza colores y dimensiones</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🚚</div>
            <div className="benefit-text">
              <h4>Envíos Seguros</h4>
              <p>Entrega e instalación en tu domicilio</p>
            </div>
          </div>
        </div>

        {/* Listado de Productos de la Categoría */}
        {loading ? (
          <div className="catalog-loading">
            <div className="home-spinner" />
            <p>Cargando muebles de {catName}...</p>
          </div>
        ) : !categoria ? (
          <div className="catalog-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>Categoría no encontrada</h3>
            <p>La categoría que buscas no existe o ha sido modificada.</p>
            <button
              type="button"
              className="btn-go-admin-cta"
              onClick={() => onNavigate && onNavigate('inicio')}
            >
              ← Volver al Inicio
            </button>
          </div>
        ) : productos.length === 0 ? (
          <div className="catalog-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>Aún no hay muebles registrados en {catName}</h3>
            <p>Próximamente agregaremos nuevos modelos en esta categoría.</p>
            {user ? (
              <button
                type="button"
                className="btn-go-admin-cta"
                onClick={() => onNavigate && onNavigate('admin')}
              >
                + Agregar Mueble en Panel Admin
              </button>
            ) : (
              <button
                type="button"
                className="btn-go-admin-cta"
                onClick={() => onNavigate && onNavigate('inicio')}
              >
                ← Volver al Inicio
              </button>
            )}
          </div>
        ) : (
          <div className="catalog-grid">
            {productos.map((p) => (
              <article
                key={p.id_mueble}
                className="product-card"
                onClick={() => onNavigate && onNavigate('producto', toSlug(p.nombre))}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-media">
                  {(p.imagen_url || p.url_imagen) ? (
                    <img
                      src={formatImageUrl(p.imagen_url || p.url_imagen)}
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
                  <span className="card-cat-badge">{p.categoria || catName}</span>
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

                    <a
                      href={getProductWhatsAppUrl(p)}
                      className="btn-whatsapp-quote"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
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
