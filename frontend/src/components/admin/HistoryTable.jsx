import { useState, useMemo } from 'react';

// Formateador de fecha amigable
const formatFecha = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
};

export default function HistoryTable({
  history = [],
  loading = false,
  onRefresh,
  onClear
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('TODAS');

  const filteredHistory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return history.filter((item) => {
      const matchSearch =
        !q ||
        (item.nombre_mueble && item.nombre_mueble.toLowerCase().includes(q)) ||
        (item.usuario_admin && item.usuario_admin.toLowerCase().includes(q)) ||
        (item.detalles && item.detalles.toLowerCase().includes(q));

      const matchAction =
        actionFilter === 'TODAS' ||
        item.accion.toUpperCase() === actionFilter.toUpperCase();

      return matchSearch && matchAction;
    });
  }, [history, searchQuery, actionFilter]);

  // Estilos de badge según acción
  const getActionBadge = (accion) => {
    switch (accion) {
      case 'CREAR':
        return <span className="history-badge create">+ CREADO</span>;
      case 'ACTUALIZAR':
        return <span className="history-badge update">✎ MODIFICADO</span>;
      case 'CAMBIO_ESTADO':
        return <span className="history-badge status">⚡ ESTADO</span>;
      case 'ELIMINAR':
        return <span className="history-badge delete">✕ ELIMINADO</span>;
      default:
        return <span className="history-badge default">{accion}</span>;
    }
  };

  return (
    <div className="panel-tab-content">
      {/* Barra de herramientas */}
      <div className="panel-toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por mueble, administrador o detalle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-actions" style={{ display: 'flex', gap: '10px' }}>
          <select
            className="admin-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="TODAS">Todas las acciones</option>
            <option value="CREAR">Creados</option>
            <option value="ACTUALIZAR">Modificados</option>
            <option value="CAMBIO_ESTADO">Cambio de Estado</option>
            <option value="ELIMINAR">Eliminados</option>
          </select>

          <button
            type="button"
            className="btn-admin-secondary"
            onClick={onRefresh}
            title="Actualizar registro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Refrescar</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner" />
          <p>Cargando auditoría de muebles...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="admin-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, color: '#94a3b8' }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3>Sin registros en el historial</h3>
          <p>Aún no se han registrado modificaciones o no coinciden con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th style={{ width: '170px' }}>Fecha y Hora</th>
                <th style={{ width: '120px' }}>Acción</th>
                <th style={{ width: '220px' }}>Mueble Afectado</th>
                <th style={{ width: '150px' }}>Responsable</th>
                <th>Detalles de la Modificación</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id_historial}>
                  <td>
                    <span className="mono-id">#{item.id_historial}</span>
                  </td>
                  <td>
                    <span className="history-time-text">{formatFecha(item.fecha)}</span>
                  </td>
                  <td>{getActionBadge(item.accion)}</td>
                  <td>
                    <div className="history-mueble-cell">
                      <strong>{item.nombre_mueble}</strong>
                      {item.id_mueble && (
                        <span className="history-mueble-id">ID: #{item.id_mueble}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-badge-mini">
                        {(item.usuario_admin || 'A')[0].toUpperCase()}
                      </span>
                      <span>{item.usuario_admin || 'admin'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="history-details-text">{item.detalles || 'Sin detalles adicionales'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

