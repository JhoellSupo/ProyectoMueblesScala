import AdminFormPage from './AdminFormPage';
import ImageUploadField from './ImageUploadField';

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
    <AdminFormPage
      title={editingBanner ? 'Editar Foto del Slider' : 'Nueva Foto para el Slider'}
      subtitle={
        editingBanner
          ? 'Actualiza la imagen, título u orden de aparición en el carrusel principal.'
          : 'Sube una fotografía horizontal de alta calidad para mostrarla en la portada de la tienda.'
      }
      backLabel="Volver a Imágenes del Slider"
      onBack={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={editingBanner ? 'Actualizar Foto' : 'Guardar en Slider'}
      submittingLabel="Guardando foto..."
    >
      <ImageUploadField
        label="Foto del Banner"
        required={!editingBanner}
        formData={formData}
        onChange={onChange}
        dropzoneTitle="Haz clic para subir o arrastra la foto del slider"
        currentStatusLabel="Foto actual del slider"
        defaultFileName="banner_scala.jpg"
        previewAlt="Vista previa del slider"
        panoramic
      />

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
    </AdminFormPage>
  );
}
