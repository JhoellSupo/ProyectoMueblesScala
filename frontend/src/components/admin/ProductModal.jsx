import AdminFormPage from './AdminFormPage';
import ImageUploadField from './ImageUploadField';

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
    <AdminFormPage
      title={editingProduct ? 'Editar Mueble' : 'Agregar Nuevo Mueble'}
      subtitle={
        editingProduct
          ? 'Actualiza el precio, dimensiones, descripción o foto del mueble seleccionado.'
          : 'Completa la información del mueble y sube su fotografía para publicarlo en el catálogo.'
      }
      backLabel="Volver al Catálogo de Muebles"
      onBack={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={editingProduct ? 'Actualizar Mueble' : 'Guardar Mueble'}
      submittingLabel="Subiendo foto y guardando..."
    >
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

      <fieldset className="form-fieldset">
        <legend>Dimensiones del Mueble (opcional)</legend>
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
      </fieldset>

      <ImageUploadField
        label="Foto del Mueble"
        required={!editingProduct}
        formData={formData}
        onChange={onChange}
        dropzoneTitle="Haz clic para subir o arrastra la foto del mueble"
        currentStatusLabel="Foto actual del mueble"
        defaultFileName="mueble_scala.jpg"
        previewAlt="Vista previa del mueble"
      />

      <div className="form-field full-width">
        <label htmlFor="p-desc">Descripción</label>
        <textarea
          id="p-desc"
          rows="4"
          placeholder="Descripción del diseño, acabados, tipo de estructura o confort..."
          value={formData.descripcion}
          onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
        />
      </div>
    </AdminFormPage>
  );
}
