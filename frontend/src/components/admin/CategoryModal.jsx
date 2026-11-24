export default function CategoryModal({
  isOpen,
  editingCategory,
  formData,
  onChange,
  onSubmit,
  onClose,
  isSubmitting
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="admin-modal-form">
          <div className="form-field">
            <label htmlFor="c-nombre">Nombre de la Categoría *</label>
            <input
              id="c-nombre"
              type="text"
              required
              placeholder="Ej. Comedor, Módulos TV, Dormitorio..."
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="c-desc">Descripción</label>
            <textarea
              id="c-desc"
              rows="3"
              placeholder="Detalles sobre qué muebles pertenecen a esta categoría..."
              value={formData.descripcion}
              onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="c-img">URL de Imagen de Referencia (opcional)</label>
            <input
              id="c-img"
              type="url"
              placeholder="https://images.unsplash.com/... o enlace de tu imagen"
              value={formData.imagen_url || ''}
              onChange={(e) => onChange({ ...formData, imagen_url: e.target.value })}
            />
            {formData.imagen_url && (
              <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', height: 110, background: '#f1f5f9' }}>
                <img
                  src={formData.imagen_url}
                  alt="Vista previa categoría"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-admin-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-admin-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

