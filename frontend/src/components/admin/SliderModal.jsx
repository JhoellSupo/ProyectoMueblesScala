export default function SliderModal({
  isOpen,
  editingBanner,
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
          <h2>{editingBanner ? 'Editar Imagen del Slider' : 'Nueva Imagen para el Slider'}</h2>
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
            <label htmlFor="b-img">URL de la Imagen *</label>
            <input
              id="b-img"
              type="url"
              required
              placeholder="https://images.unsplash.com/... o enlace de tu imagen"
              value={formData.imagen_url}
              onChange={(e) => onChange({ ...formData, imagen_url: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label htmlFor="b-titulo">Título / Etiqueta (opcional)</label>
              <input
                id="b-titulo"
                type="text"
                placeholder="Ej. Colección Sala Velvet"
                value={formData.titulo}
                onChange={(e) => onChange({ ...formData, titulo: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="b-orden">Orden de aparición</label>
              <input
                id="b-orden"
                type="number"
                min="0"
                placeholder="1, 2, 3..."
                value={formData.orden}
                onChange={(e) => onChange({ ...formData, orden: e.target.value })}
              />
            </div>
          </div>

          {/* Vista previa en tamaño panorámico */}
          {formData.imagen_url && (
            <div className="modal-img-preview-box">
              <span className="preview-label">Vista Previa de la Imagen:</span>
              <div
                className="preview-thumb"
                style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden' }}
              >
                <img
                  src={formData.imagen_url}
                  alt="Vista previa del slider"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

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
              {isSubmitting ? 'Guardando...' : editingBanner ? 'Actualizar Imagen' : 'Guardar en Slider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

