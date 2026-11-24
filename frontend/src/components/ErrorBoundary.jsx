import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#022f30',
          color: '#ffffff',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '40px 32px',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '12px', color: '#dfb166' }}>
              Muebles Scala
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '24px', lineHeight: 1.6 }}>
              Ocurrió un error inesperado al cargar la página. Por favor, intenta recargar.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: '#dfb166',
                color: '#022f30',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔄 Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

