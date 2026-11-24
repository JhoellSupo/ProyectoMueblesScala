import { useState, useMemo } from 'react';

// Formatear fecha
const formatFecha = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
};

export default function AdminUsersTable({
  admins = [],
  loading = false,
  currentUser,
  onNewAdmin,
  onToggleStatus,
  onDeleteAdmin
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAdmins = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return admins.filter((a) => {
      return (
        !q ||
        (a.nombre && a.nombre.toLowerCase().includes(q)) ||
        (a.usuario && a.usuario.toLowerCase().includes(q)) ||
        (a.correo && a.correo.toLowerCase().includes(q)) ||
        (a.rol && a.rol.toLowerCase().includes(q))
      );
    });
  }, [admins, searchQuery]);

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
            placeholder="Buscar por nombre o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={onNewAdmin}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Nuevo Administrador</span>
        </button>
      </div>

      {loading ? (
        <div className="admin-loading-state">
          <div className="spinner" />
          <p>Cargando administradores...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No se encontraron administradores</h3>
          <p>Puedes registrar un nuevo administrador para que tenga acceso al panel.</p>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={onNewAdmin}
          >
            + Registrar Administrador
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th style={{ width: '150px' }}>Rol de Acceso</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Estado</th>
                <th style={{ width: '140px' }}>Fecha Registro</th>
                <th style={{ textAlign: 'center', width: '110px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adm) => {
                const isSuper =
                  adm.rol === 'superadmin' ||
                  adm.rol === 'SUPERADMINISTRADOR' ||
                  adm.nombre === 'superadmin' ||
                  adm.usuario === 'superadmin';
                const isSelf =
                  currentUser?.id === adm.id_admin ||
                  currentUser?.nombre === adm.nombre ||
                  currentUser?.username === adm.usuario ||
                  currentUser?.usuario === adm.usuario;

                return (
                  <tr key={adm.id_admin}>
                    <td>
                      <span className="mono-id">#{adm.id_admin}</span>
                    </td>
                    <td>
                      <div className="admin-user-cell">
                        <span className={`admin-user-badge-mini ${isSuper ? 'super' : ''}`}>
                          {(adm.nombre || adm.usuario || 'A')[0].toUpperCase()}
                        </span>
                        <div>
                          <strong>{adm.nombre}</strong>
                          {isSelf && <span className="self-tag">(Tú)</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-email-text" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {adm.usuario || adm.correo}
                      </span>
                    </td>
                    <td>
                      {isSuper ? (
                        <span className="role-badge super">👑 SUPERADMIN</span>
                      ) : (
                        <span className="role-badge regular">🛡️ ADMINISTRADOR</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`status-pill-toggle ${adm.activo ? 'active' : 'inactive'}`}
                        onClick={() => onToggleStatus && onToggleStatus(adm)}
                        disabled={isSuper}
                        title={
                          isSuper
                            ? 'El Superadmin principal no puede ser desactivado'
                            : adm.activo
                            ? 'Clic para desactivar'
                            : 'Clic para activar'
                        }
                      >
                        <span className="status-dot" />
                        <span>{adm.activo ? 'Activo' : 'Inactivo'}</span>
                      </button>
                    </td>
                    <td>
                      <span className="history-time-text">{formatFecha(adm.fecha_creacion)}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn-action-icon delete"
                        onClick={() => onDeleteAdmin && onDeleteAdmin(adm)}
                        disabled={isSuper || isSelf}
                        title={
                          isSuper
                            ? 'No se puede eliminar la cuenta principal de Superadmin'
                            : isSelf
                            ? 'No puedes eliminar tu propia cuenta en uso'
                            : 'Eliminar administrador'
                        }
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

