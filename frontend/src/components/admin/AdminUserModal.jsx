export default function AdminUserModal({
  isOpen,
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
          <h2>Nuevo Administrador</h2>
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
            <label htmlFor="adm-nombre">Nombre Completo *</label>
            <input
              id="adm-nombre"
              type="text"
              required
              placeholder="Ej. Carlos Mendoza, Supervisor, etc."
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="adm-usuario">Usuario *</label>
            <input
              id="adm-usuario"
              type="text"
              required
              placeholder="Ej. carlos_scala, supervisor, etc."
              value={formData.usuario ?? formData.correo ?? ''}
              onChange={(e) =>
                onChange({
                  ...formData,
                  usuario: e.target.value,
                  correo: e.target.value
                })
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="adm-pass">Contraseña Inicial *</label>
            <input
              id="adm-pass"
              type="password"
              required
              minLength={4}
              placeholder="Mínimo 4 caracteres"
              value={formData.password}
              onChange={(e) => onChange({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label htmlFor="adm-rol">Rol del Usuario</label>
            <select
              id="adm-rol"
              value={formData.rol || 'admin'}
              onChange={(e) => onChange({ ...formData, rol: e.target.value })}
              className="admin-select"
            >
              <option value="admin">Administrador Regular (Catálogo, Categorías, Slider)</option>
              <option value="superadmin">Superadministrador (Acceso Total + Historial + Usuarios)</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-admin-secondary"
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
              {isSubmitting ? 'Guardando...' : 'Crear Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

