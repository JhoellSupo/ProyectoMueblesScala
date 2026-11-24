import { useRef, useState } from 'react';
import { formatImageUrl } from '../../services/apiClient';

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
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  if (!isOpen) return null;

  // Manejar archivo seleccionado (por input o drop)
  const processFile = (file) => {
    setFileError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Solo se permiten archivos de imagen (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('La imagen no debe superar los 10 MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({
      ...formData,
      imageFile: file,
      imagePreview: previewUrl,
      fileName: file.name
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange({
      ...formData,
      imageFile: null,
      imagePreview: '',
      imagen_url: '',
      fileName: ''
    });
  };

  const previewSource = formData.imagePreview
    ? formatImageUrl(formData.imagePreview)
    : formData.imagen_url
    ? formatImageUrl(formData.imagen_url)
    : null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingProduct ? 'Editar Mueble' : 'Agregar Nuevo Mueble'}</h2>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Cerrar modal"
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
                placeholder="Ej. Sofá Modular Velvet, Juego de Sala..."
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
              <label htmlFor="p-precio-oferta">Precio Oferta (S/.) Opcional</label>
              <input
                id="p-precio-oferta"
                type="number"
                step="0.01"
                min="0"
                placeholder="Dejar vacío si no aplica oferta"
                value={formData.precio_oferta || ''}
                onChange={(e) => onChange({ ...formData, precio_oferta: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-field">
              <label htmlFor="p-largo">Largo (cm)</label>
              <input
                id="p-largo"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ej. 240"
                value={formData.largo_cm || ''}
                onChange={(e) => onChange({ ...formData, largo_cm: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="p-ancho">Ancho / Prof. (cm)</label>
              <input
                id="p-ancho"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ej. 160"
                value={formData.ancho_cm || ''}
                onChange={(e) => onChange({ ...formData, ancho_cm: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label htmlFor="p-alto">Alto (cm)</label>
              <input
                id="p-alto"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ej. 85"
                value={formData.alto_cm || ''}
                onChange={(e) => onChange({ ...formData, alto_cm: e.target.value })}
              />
            </div>
          </div>

          {/* ZONA DE SUBIDA DE IMAGEN (SOLO SUBIDA DE ARCHIVO, SIN URL) */}
          <div className="form-field full-width">
            <label>
              Foto del Mueble {!editingProduct && <span className="required-star">*</span>}
            </label>

            {/* Input nativo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {!previewSource ? (
              <div
                className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current && fileInputRef.current.click();
                  }
                }}
              >
                <div className="dropzone-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="dropzone-text">
                  <strong>Haz clic para subir o arrastra la foto del mueble</strong>
                  <span>Formatos admitidos: JPG, PNG o WEBP (hasta 10 MB)</span>
                </div>
                <button
                  type="button"
                  className="btn-select-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                >
                  Seleccionar Foto
                </button>
              </div>
            ) : (
              <div className="image-upload-preview-card">
                <div className="preview-image-wrapper">
                  <img
                    src={previewSource}
                    alt="Vista previa del mueble"
                    className="preview-img-element"
                  />
                </div>
                <div className="preview-image-info">
                  <span className="preview-badge-status">
                    {formData.imageFile ? '✓ Nueva foto seleccionada' : 'Foto actual del mueble'}
                  </span>
                  <span className="preview-filename">
                    {formData.fileName || 'mueble_scala.jpg'}
                  </span>
                  <div className="preview-actions-row">
                    <button
                      type="button"
                      className="btn-change-image"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Cambiar Foto</span>
                    </button>
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleRemoveImage}
                      title="Quitar foto seleccionada"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Quitar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {fileError && <p className="file-upload-error">{fileError}</p>}
          </div>

          <div className="form-field full-width">
            <label htmlFor="p-desc">Descripción</label>
            <textarea
              id="p-desc"
              rows="3"
              placeholder="Descripción del diseño, acabados, tipo de estructura o confort..."
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
              {isSubmitting
                ? 'Subiendo foto y guardando...'
                : editingProduct
                ? 'Actualizar Mueble'
                : 'Guardar Mueble'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
