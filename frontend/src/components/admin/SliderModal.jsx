import { useRef, useState } from 'react';
import { formatImageUrl } from '../../services/apiClient';

export default function SliderModal({
  isOpen,
  editingBanner,
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

  // Procesar archivo seleccionado (por input o arrastre)
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
    ? formData.imagePreview
    : formData.imagen_url
    ? formatImageUrl(formData.imagen_url)
    : null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingBanner ? 'Editar Foto del Slider' : 'Nueva Foto para el Slider'}</h2>
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
          {/* ZONA DE SUBIDA DE IMAGEN (SOLO SUBIDA DE ARCHIVO, SIN URL) */}
          <div className="form-field full-width">
            <label>
              Foto del Banner {!editingBanner && <span className="required-star">*</span>}
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
                  <strong>Haz clic para subir o arrastra la foto del slider</strong>
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
              <div className="image-upload-preview-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div
                  className="preview-image-wrapper"
                  style={{ width: '100%', height: '180px', borderRadius: '8px' }}
                >
                  <img
                    src={previewSource}
                    alt="Vista previa del slider"
                    className="preview-img-element"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="preview-image-info" style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="preview-badge-status">
                      {formData.imageFile ? '✓ Nueva foto seleccionada' : 'Foto actual del slider'}
                    </span>
                    <span className="preview-filename" style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {formData.fileName || 'banner_scala.jpg'}
                    </span>
                  </div>
                  <div className="preview-actions-row" style={{ marginTop: '8px' }}>
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
                      Cambiar Foto
                    </button>
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={handleRemoveImage}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {fileError && <p className="form-error-msg">{fileError}</p>}
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label htmlFor="b-titulo">Título / Etiqueta (opcional)</label>
              <input
                id="b-titulo"
                type="text"
                placeholder="Ej. Colección Sala Velvet"
                value={formData.titulo || ''}
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
                value={formData.orden || ''}
                onChange={(e) => onChange({ ...formData, orden: e.target.value })}
              />
            </div>
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
              {isSubmitting ? 'Guardando foto...' : editingBanner ? 'Actualizar Foto' : 'Guardar en Slider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
