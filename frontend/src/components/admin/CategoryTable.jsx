export default function CategoryTable({
  categories,
  searchQuery,
  onSearchChange,
  loading,
  onNewCategory,
  onEditCategory,
  onDeleteCategory
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
            placeholder="Buscar categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={onNewCategory}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nueva Categoría</span>
        </button>
      </div>

      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner" />
          <p>Cargando categorías...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No hay categorías registradas</h3>
          <p>Crea tu primera categoría para organizar el catálogo de muebles.</p>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={onNewCategory}
          >
            + Agregar primera categoría
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th style={{ width: '80px' }}>Imagen</th>
                <th>Nombre de la Categoría</th>
                <th>Descripción</th>
                <th>Productos Asignados</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id_categoria}>
                  <td>
                    <span className="mono-id">#{c.id_categoria}</span>
                  </td>
                  <td>
                    {c.imagen_url ? (
                      <img
                        src={c.imagen_url}
                        alt={c.nombre}
                        className="product-table-thumb"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="table-thumb-empty">Sin foto</span>
                    )}
                  </td>
                  <td>
                    <span className="category-cell-name">{c.nombre}</span>
                  </td>
                  <td>
                    <span className="category-cell-desc">
                      {c.descripcion || 'Sin descripción'}
                    </span>
                  </td>
                  <td>
                    <span className="count-badge">
                      {c.total_productos || 0} muebles
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => onEditCategory(c)}
                        title="Editar categoría"
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
                          onDeleteCategory({
                            type: 'categoria',
                            id: c.id_categoria,
                            name: c.nombre
                          })
                        }
                        title="Eliminar categoría"
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

