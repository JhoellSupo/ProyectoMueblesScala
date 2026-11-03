export default function ProductModal({
  isOpen,
  editingProduct,
  categories,
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
          <h2>{editingProduct ? 'Editar Mueble' : 'Agregar Nuevo Mueble'}</h2>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="admin-modal-form">
          <div className="form-row-2">
            <div className="form-field">
              <label htmlFor="p-nombre">Nombre del Mueble *</label>
              <input
                id="p-nombre"
                type="text"
                required
                placeholder="Ej. Sofá Modular Velvet"
                value={formData.nombre}
                onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="p-cat">Categoría *</label>
              <select
                id="p-cat"
                required
                value={formData.id_categoria}
                onChange={(e) => onChange({ ...formData, id_categoria: e.target.value })}
              >
                <option value="">Selecciona categoría</option>
                {categories.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label htmlFor="p-precio">Precio (S/.) *</label>
              <input
                id="p-precio"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData.precio}
                onChange={(e) => onChange({ ...formData, precio: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="p-img">URL de Imagen</label>
              <input
                id="p-img"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imagen_url}
                onChange={(e) => onChange({ ...formData, imagen_url: e.target.value })}
              />
            </div>
          </div>

          {/* Vista previa de imagen */}
          {formData.imagen_url && (
            <div className="modal-img-preview-box">
              <span className="preview-label">Vista Previa de la Imagen:</span>
              <div className="preview-thumb">
                <img
                  src={formData.imagen_url}
                  alt="Vista previa"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="p-desc">Descripción</label>
            <textarea
              id="p-desc"
              rows="3"
              placeholder="Descripción del mueble..."
              value={formData.descripcion}
              onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
            />
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
              {isSubmitting ? 'Guardando...' : editingProduct ? 'Actualizar Mueble' : 'Guardar Mueble'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

