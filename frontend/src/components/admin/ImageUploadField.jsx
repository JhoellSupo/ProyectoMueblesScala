import { useRef, useState } from 'react';
import { formatImageUrl } from '../../services/apiClient';

/**
 * Campo reutilizable para subir imágenes arrastrando o seleccionando archivo (sin URL manual).
 */
export default function ImageUploadField({
  label,
  required = false,
  formData,
  onChange,
  dropzoneTitle = 'Haz clic para subir o arrastra una imagen',
  currentStatusLabel = 'Foto actual',
  defaultFileName = 'imagen_scala.jpg',
  previewAlt = 'Vista previa de la imagen',
  panoramic = false
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

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

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const previewSource = formData.imagePreview
    ? formatImageUrl(formData.imagePreview)
    : formData.imagen_url
    ? formatImageUrl(formData.imagen_url)
    : null;

  return (
    <div className="form-field full-width">
      <label>
        {label} {required && <span className="required-star">*</span>}
      </label>

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
          onClick={triggerFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFilePicker();
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
            <strong>{dropzoneTitle}</strong>
            <span>Formatos admitidos: JPG, PNG o WEBP (hasta 10 MB)</span>
          </div>
          <button
            type="button"
            className="btn-select-file"
            onClick={(e) => {
              e.stopPropagation();
              triggerFilePicker();
            }}
          >
            Seleccionar Foto
          </button>
        </div>
      ) : (
        <div
          className={`image-upload-preview-card ${panoramic ? 'panoramic-preview-card' : ''}`}
        >
          <div
            className={`preview-image-wrapper ${panoramic ? 'panoramic-preview-wrapper' : ''}`}
          >
            <img
              src={previewSource}
              alt={previewAlt}
              className="preview-img-element"
            />
          </div>
          <div className="preview-image-info">
            <div className="preview-meta-row">
              <span className="preview-badge-status">
                {formData.imageFile ? '✓ Nueva foto seleccionada' : currentStatusLabel}
              </span>
              <span className="preview-filename">
                {formData.fileName || defaultFileName}
              </span>
            </div>
            <div className="preview-actions-row">
              <button
                type="button"
                className="btn-change-image"
                onClick={triggerFilePicker}
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
  );
}
