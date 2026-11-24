export default function StatsCards({ stats }) {
  return (
    <section className="admin-kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon-box gold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Total Productos</span>
          <span className="kpi-value">{stats.totalProd}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-box green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Productos Activos</span>
          <span className="kpi-value">{stats.activos}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-box purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Categorías Registradas</span>
          <span className="kpi-value">{stats.totalCat}</span>
        </div>
      </div>
    </section>
  );
}
