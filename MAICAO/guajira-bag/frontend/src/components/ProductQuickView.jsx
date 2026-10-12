export default function ProductQuickView({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <div className="quick-veil" onClick={onClose} role="presentation">
      <div className="quick-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={product.name}>
        <div className="quick-card__img">
          <img src={product.image} alt={product.name} loading="eager" />
        </div>
        <div className="quick-card__info">
          <h3>{product.name}</h3>
          <p className="quick-card__price">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}</p>
          <p className="desc">{product.details || product.desc}</p>
          <div className="quick-card__actions">
            <button type="button" className="btn btn--gold" onClick={() => { onAdd(product); onClose(); }}>Agregar al carrito</button>
            <button type="button" className="btn btn--line" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
