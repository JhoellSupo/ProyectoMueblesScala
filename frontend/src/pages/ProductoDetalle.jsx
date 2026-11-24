import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productoService } from '../services/productoService';
import { formatImageUrl } from '../services/apiClient';
import './ProductoDetalle.css';
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

export default function ProductoDetalle({ productIdentifier, user, onLogout, onNavigate }) {
  const [producto, setProducto] = useState(null);
  const [mueblesRelacionados, setMueblesRelacionados] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductoData = async () => {
      setLoading(true);
      try {
        let detalle = null;
        try {
          detalle = await productoService.obtenerPorId(productIdentifier);
        } catch {
          // Si no encontró por slug directo, buscar por coincidencia en catálogo
          const todosLosMuebles = await productoService.listar({ soloActivos: 1 });
          const identSlug = toSlug(productIdentifier);
          const match = (todosLosMuebles || []).find((p) => {
            return (
              p.slug === identSlug ||
              toSlug(p.nombre) === identSlug ||
              String(p.id_muebles || p.id_mueble) === String(productIdentifier) ||
              normalizeText(p.nombre) === normalizeText(productIdentifier)
            );
          });
          if (match) {
            detalle = await productoService.obtenerPorId(match.id_muebles || match.id_mueble);
          }
        }

        if (detalle) {
          setProducto(detalle);
          const rawImg = detalle.url_imagen || detalle.imagen_url || detalle.imagenes?.[0]?.url_imagen || '';
          setSelectedImage(formatImageUrl(rawImg));

          // Cargar muebles relacionados de la misma categoría
          const catId = detalle.id_categorias || detalle.id_categoria;
          if (catId) {
            const relacionados = await productoService.listar({ categoria: catId, soloActivos: 1 });
            setMueblesRelacionados(
              (relacionados || [])
                .filter((p) => (p.id_muebles || p.id_mueble) !== (detalle.id_muebles || detalle.id_mueble))
                .slice(0, 3)
            );
          }
        } else {
          setProducto(null);
        }
      } catch (err) {
        console.error('Error al cargar detalle del mueble:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productIdentifier) {
      fetchProductoData();
    }
  }, [productIdentifier]);

  // Galería de imágenes únicas del mueble
  const allImages = [];
  if (producto?.imagen_url) allImages.push(formatImageUrl(producto.imagen_url));
  if (producto?.url_imagen && !allImages.includes(formatImageUrl(producto.url_imagen))) {
    allImages.push(formatImageUrl(producto.url_imagen));
  }
  if (producto?.imagenes && producto.imagenes.length > 0) {
    producto.imagenes.forEach((img) => {
      const fUrl = formatImageUrl(img.url_imagen);
      if (fUrl && !allImages.includes(fUrl)) {
        allImages.push(fUrl);
      }
    });
  }

  // Identificador activo para el Navbar
  const getActiveNavItem = () => {
    if (!producto?.categoria) return '';
    const norm = normalizeText(producto.categoria);
    if (norm.includes('sala')) return 'sala';
    if (norm.includes('comedor')) return 'comedor';
    if (norm.includes('modulo') || norm.includes('tv')) return 'modulos-tv';
    return toSlug(producto.categoria);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Muebles Scala, deseo consultar sobre el mueble: *${producto?.nombre || ''}* (Precio: S/. ${
      producto?.precio || ''
    }). ¿Podrían brindarme información sobre disponibilidad y tiempos de entrega?`
  );

  return (
    <div className="product-detail-container">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeItem={getActiveNavItem()}
      />

      <main className="product-detail-main">
        {loading ? (
          <div className="catalog-loading" style={{ minHeight: '50vh' }}>
            <div className="home-spinner" />
            <p>Cargando detalles del mueble...</p>
          </div>
        ) : !producto ? (
          <div className="catalog-empty" style={{ minHeight: '50vh' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3>Mueble no encontrado</h3>
            <p>El producto solicitado no está disponible o ha sido retirado del catálogo.</p>
            <button
              type="button"
              className="btn-go-admin-cta"
              onClick={() => onNavigate && onNavigate('inicio')}
            >
              ← Volver al Inicio
            </button>
          </div>
        ) : (
          <>
            {/* Migas de pan / Breadcrumb */}
            <nav className="product-breadcrumb" aria-label="Migas de pan">
              <button type="button" onClick={() => onNavigate && onNavigate('inicio')}>
                Inicio
              </button>
              <span className="breadcrumb-separator">/</span>
              {producto.categoria && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate && onNavigate('categoria', toSlug(producto.categoria))
                    }
                  >
                    {producto.categoria}
                  </button>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
              <span className="current-page">{producto.nombre}</span>
            </nav>

            {/* Ficha del Producto (Layout 2 columnas) */}
            <div className="product-showcase-layout">
              {/* Columna Izquierda: Galería */}
              <div className="product-gallery-col">
                <div className="product-main-image-box">
                  <img
                    src={selectedImage || '/paguinalogo.jpeg'}
                    alt={producto.nombre}
                    className="product-main-img"
                    onError={(e) => {
                      e.target.src = '/paguinalogo.jpeg';
                    }}
                  />
                  <span className="product-cat-pill">{producto.categoria || 'Scala'}</span>
                </div>

                {allImages.length > 1 && (
                  <div className="product-thumbnails-strip">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`product-thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                        onClick={() => setSelectedImage(imgUrl)}
                        aria-label={`Ver foto ${idx + 1}`}
                      >
                        <img src={imgUrl} alt={`Miniatura ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Columna Derecha: Especificaciones e Información */}
              <div className="product-info-col">
                <span className="product-brand-tag">
                  {producto.marca || 'Scala'} • FABRICACIÓN EXCLUSIVA
                </span>
                <h1 className="product-title">{producto.nombre}</h1>

                <div className="product-price-section">
                  <span className="product-currency">S/.</span>
                  <span className="product-amount">
                    {Number(producto.precio).toLocaleString('es-PE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className="product-payment-note">Incluye IGV • Boleta o Factura</span>
                </div>

                <div className="product-description-box">
                  <h3>Descripción del Mueble</h3>
                  <p>
                    {producto.descripcion ||
                      'Mueble exclusivo de alta resistencia diseñado con finos acabados y materiales de primera calidad.'}
                  </p>
                </div>

                {/* Dimensiones y Medidas del Mueble */}
                {((producto.medidas && producto.medidas.length > 0) || producto.largo_cm || producto.ancho_cm || producto.alto_cm) && (
                  <div className="product-specs-box">
                    <h4 className="specs-title">📐 Dimensiones del Mueble</h4>
                    {producto.medidas && producto.medidas.length > 0 ? (
                      <div className="specs-pieces-list">
                        {producto.medidas.map((m, idx) => (
                          <div key={idx} className="spec-piece-row" style={{ marginBottom: idx < producto.medidas.length - 1 ? '12px' : '0' }}>
                            {producto.medidas.length > 1 && (
                              <div className="piece-name" style={{ fontWeight: 700, fontSize: '0.86rem', color: '#024042', marginBottom: '4px' }}>
                                {m.nombre_pieza} {m.cantidad > 1 ? `(${m.cantidad} unidades)` : ''}:
                              </div>
                            )}
                            <div className="specs-grid">
                              {m.largo_cm && (
                                <div className="spec-item">
                                  <span className="spec-label">Largo</span>
                                  <span className="spec-value">{parseFloat(m.largo_cm)} cm</span>
                                </div>
                              )}
                              {m.ancho_cm && (
                                <div className="spec-item">
                                  <span className="spec-label">Ancho / Prof.</span>
                                  <span className="spec-value">{parseFloat(m.ancho_cm)} cm</span>
                                </div>
                              )}
                              {m.alto_cm && (
                                <div className="spec-item">
                                  <span className="spec-label">Alto</span>
                                  <span className="spec-value">{parseFloat(m.alto_cm)} cm</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="specs-grid">
                        {producto.largo_cm && (
                          <div className="spec-item">
                            <span className="spec-label">Largo</span>
                            <span className="spec-value">{parseFloat(producto.largo_cm)} cm</span>
                          </div>
                        )}
                        {producto.ancho_cm && (
                          <div className="spec-item">
                            <span className="spec-label">Ancho / Prof.</span>
                            <span className="spec-value">{parseFloat(producto.ancho_cm)} cm</span>
                          </div>
                        )}
                        {producto.alto_cm && (
                          <div className="spec-item">
                            <span className="spec-label">Alto</span>
                            <span className="spec-value">{parseFloat(producto.alto_cm)} cm</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="custom-size-note">
                      <span>📐</span>
                      <span>¿Necesitas medidas personalizadas? Lo fabricamos a la medida de tu espacio.</span>
                    </p>
                  </div>
                )}

                {/* Chips de Ventajas */}
                <div className="product-perks-list">
                  <span className="perk-chip">🛡️ Garantía de fábrica</span>
                  <span className="perk-chip">🚚 Envíos a domicilio</span>
                </div>

                {/* Botones de Acción */}
                <div className="product-actions-group">
                  <a
                    href={`https://wa.me/51952003883?text=${whatsappMessage}`}
                    className="btn-whatsapp-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                    </svg>
                    <span>Cotizar y Pedir por WhatsApp</span>
                  </a>

                  {producto.categoria && (
                    <button
                      type="button"
                      className="btn-back-category"
                      onClick={() =>
                        onNavigate && onNavigate('categoria', toSlug(producto.categoria))
                      }
                    >
                      ← Volver a {producto.categoria}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Muebles Relacionados */}
            {mueblesRelacionados.length > 0 && (
              <section className="related-products-section">
                <div className="related-header">
                  <span className="related-tag">MÁS DE ESTA COLECCIÓN</span>
                  <h2 className="related-title">Muebles Recomendados</h2>
                </div>

                <div className="catalog-grid">
                  {mueblesRelacionados.map((rel) => (
                    <article
                      key={rel.id_mueble}
                      className="product-card"
                      onClick={() => onNavigate && onNavigate('producto', toSlug(rel.nombre))}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-media">
                        <img
                          src={formatImageUrl(rel.imagen_url || rel.url_imagen)}
                          alt={rel.nombre}
                          className="card-image"
                          onError={(e) => {
                            e.target.src = '/paguinalogo.jpeg';
                          }}
                        />
                        <span className="card-cat-badge">{rel.categoria || 'Scala'}</span>
                      </div>

                      <div className="card-body">
                        <h3 className="card-title">{rel.nombre}</h3>
                        <p className="card-description">
                          {rel.descripcion || 'Mueble fabricado con finos materiales.'}
                        </p>

                        <div className="card-footer">
                          <div className="card-price-box">
                            <span className="price-currency">S/.</span>
                            <span className="price-amount">
                              {Number(rel.precio).toLocaleString('es-PE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>

                          <span className="btn-whatsapp-quote" style={{ pointerEvents: 'none' }}>
                            Ver Detalle
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

