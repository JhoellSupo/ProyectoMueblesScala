/**
 * Contenedor de página completa para formularios de administración
 * Evita modales flotantes y desbordamientos en pantallas pequeñas.
 */
export default function AdminFormPage({
  title,
  subtitle,
  backLabel = 'Volver al listado',
  onBack,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Guardar',
  submittingLabel = 'Guardando...',
  children
}) {
  return (
    <section className="admin-form-page-wrapper" aria-label={title}>
      <div className="admin-form-page-top">
        <button
          type="button"
          className="btn-form-page-back"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{backLabel}</span>
        </button>
      </div>

      <div className="admin-form-page-card">
        <div className="admin-form-page-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="admin-form-page-subtitle">{subtitle}</p>}
          </div>
        </div>

        <form onSubmit={onSubmit} className="admin-modal-form admin-fullpage-form">
          {children}

          <div className="modal-actions admin-fullpage-actions">
            <button
              type="button"
              className="btn-admin-cancel"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-admin-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
