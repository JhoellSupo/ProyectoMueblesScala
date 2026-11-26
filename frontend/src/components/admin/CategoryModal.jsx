import AdminFormPage from './AdminFormPage';
import { formatImageUrl } from '../../services/apiClient';

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
    <AdminFormPage
      title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      subtitle={
        editingCategory
          ? 'Modifica el nombre, descripción o imagen representativa de esta categoría.'
          : 'Crea una nueva sección para organizar los muebles dentro del catálogo.'
      }
      backLabel="Volver a Gestión de Categorías"
      onBack={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
      submittingLabel="Guardando..."
    >
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
          rows="4"
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
          <div className="category-form-preview-box">
            <img
              src={formatImageUrl(formData.imagen_url)}
              alt="Vista previa categoría"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </AdminFormPage>
  );
}
