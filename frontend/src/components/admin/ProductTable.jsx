import { formatImageUrl } from '../../services/apiClient';

export default function ProductTable({
  products,
  categories,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  loading,
  onNewProduct,
  onEditProduct,
  onToggleStatus,
  onDeleteProduct
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
            placeholder="Buscar producto por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="cat-filter" className="filter-label">Categoría:</label>
          <select
            id="cat-filter"
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={onNewProduct}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nuevo Producto</span>
        </button>
      </div>

      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner" />
          <p>Cargando productos de la base de datos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="admin-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar tu búsqueda o añade un nuevo producto al catálogo.</p>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={onNewProduct}
          >
            + Agregar primer producto
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Imagen</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id_mueble}>
                  <td>
                    <div className="product-table-thumb">
                      {(p.imagen_url || p.url_imagen) ? (
                        <img
                          src={formatImageUrl(p.imagen_url || p.url_imagen)}
                          alt={p.nombre}
                          onError={(e) => {
                            e.target.src = '/paguinalogo.jpeg';
                          }}
                        />
                      ) : (
                        <div className="thumb-placeholder">Scala</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="product-info-cell">
                      <span className="product-cell-title">{p.nombre}</span>
                      <span className="product-cell-desc">
                        {p.descripcion
                          ? p.descripcion.length > 70
                            ? p.descripcion.substring(0, 70) + '...'
                            : p.descripcion
                          : 'Sin descripción'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="cat-pill-badge">{p.categoria || 'General'}</span>
                  </td>
                  <td>
                    <span className="product-cell-price">
                      S/. {Number(p.precio).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`status-pill ${p.activo === 1 ? 'active' : 'inactive'}`}
                      onClick={() => onToggleStatus(p)}
                      title="Haz clic para cambiar estado"
                    >
                      <span className="status-dot" />
                      <span>{p.activo === 1 ? 'Activo' : 'Inactivo'}</span>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => onEditProduct(p)}
                        title="Editar producto"
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
                          onDeleteProduct({
                            type: 'producto',
                            id: p.id_mueble,
                            name: p.nombre
                          })
                        }
                        title="Eliminar producto"
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

