export default function SliderTable({
  banners,
  searchQuery,
  onSearchChange,
  loading,
  onNewBanner,
  onEditBanner,
  onToggleStatus,
  onDeleteBanner
}) {
  return (
    <div className="panel-tab-content">
      {/* Barra de herramientas */}
      <div className="panel-toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar imagen del slider por título o URL..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={onNewBanner}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nueva Imagen Slider</span>
        </button>
      </div>

      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner" />
          <p>Cargando imágenes del slider...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="admin-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <h3>No hay imágenes en el slider</h3>
          <p>Añade imágenes de alta calidad para lucirlas en el carrusel de la página principal.</p>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={onNewBanner}
          >
            + Agregar primera imagen
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Vista Previa</th>
                <th>Título / Descripción</th>
                <th style={{ width: '100px' }}>Orden</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id_banner}>
                  <td>
                    <div className="product-table-thumb" style={{ width: '110px', height: '60px', borderRadius: '8px' }}>
                      <img
                        src={b.imagen_url}
                        alt={b.titulo || 'Banner'}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        onError={(e) => {
                          e.target.src = '/paguinalogo.jpeg';
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="product-info-cell">
                      <span className="product-cell-title">
                        {b.titulo || 'Imagen sin título'}
                      </span>
                      <span className="product-cell-desc" style={{ maxWidth: '380px' }}>
                        {b.imagen_url}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="mono-id">#{b.orden || 0}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`status-pill ${b.activo === 1 ? 'active' : 'inactive'}`}
                      onClick={() => onToggleStatus(b)}
                      title="Haz clic para cambiar estado en el carrusel"
                    >
                      <span className="status-dot" />
                      <span>{b.activo === 1 ? 'Visible' : 'Oculto'}</span>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => onEditBanner(b)}
                        title="Editar imagen"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() =>
                          onDeleteBanner({
                            type: 'imagen del slider',
                            id: b.id_banner,
                            name: b.titulo || 'Imagen de slider'
                          })
                        }
                        title="Eliminar imagen"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

