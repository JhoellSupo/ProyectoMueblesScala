export default function DeleteConfirmModal({
  confirmData,
  onConfirm,
  onClose,
  isSubmitting
}) {
  if (!confirmData) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-dialog confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>
        <h3>¿Eliminar {confirmData.type}?</h3>
        <p>
          Estás a punto de eliminar permanentemente:
          <br />
          <strong>"{confirmData.name}"</strong>.
          <br />
          Esta acción no se puede deshacer.
        </p>

        <div className="modal-actions confirm-actions">
          <button
            type="button"
            className="btn-admin-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-admin-danger"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

