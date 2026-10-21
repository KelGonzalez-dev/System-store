import { Component } from 'react';

/** Si una sección falla, muestra un aviso con opción de recargar en vez de dejar la página en blanco. */
export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[Guajira Bags]', error, info?.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="oops">
        <img src="/images/emblema-192.webp" alt="" width="96" height="96" />
        <h2>Algo no cargó bien</h2>
        <p>Recarga la página para intentarlo de nuevo.</p>
        <button type="button" className="btn btn--gold" onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }
}
