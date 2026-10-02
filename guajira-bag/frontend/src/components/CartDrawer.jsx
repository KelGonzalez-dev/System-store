import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { WA_NUMBER, fmt } from '../data';
import ProductQuickView from './ProductQuickView';

export default function CartDrawer({ cart, setCart, isOpen, onClose }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const updateQty = (id, delta) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)).filter((i) => i.qty > 0));

  const sendOrder = () => {
    if (!name.trim()) return alert('Por favor ingresa tu nombre');
    if (!city.trim()) return alert('Por favor ingresa tu ciudad');
    let msg = `*PEDIDO — Guajira Bags*\n\n*Cliente:* ${name}\n*Ciudad:* ${city}\n\n*Productos:*\n`;
    cart.forEach((i) => {
      const codePart = i.codigo ? ` (codigo: ${i.codigo})` : '';
      msg += `• ${i.name}${codePart} — ID:${i.id} x${i.qty} = ${fmt(i.price * i.qty)}\n`;
    });
    msg += `\n*TOTAL: ${fmt(total)}*\n\nQuiero hacer este pedido. Por favor confirmen disponibilidad y el precio final. Gracias.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose();
  };

  return (
    <>
      {isOpen && <div className="cart-veil" onClick={onClose} role="presentation" />}
      <aside className={`cart-drawer${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-drawer__head">
          <h2>Tu carrito</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar carrito"><X size={20} /></button>
        </div>
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-row">
                <button type="button" className="cart-row__thumb" onClick={() => setPreview(item)} aria-label={`Ver ${item.name}`}>
                  <img src={item.image} alt={item.name} loading="lazy" />
                </button>
                <div className="cart-row__info">
                  <p className="name">{item.name}</p>
                  <p className="price">{fmt(item.price)} c/u</p>
                </div>
                <div className="cart-row__qty">
                  <button type="button" onClick={() => updateQty(item.id, -1)} aria-label="Quitar uno"><Minus size={12} /></button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} aria-label="Agregar uno"><Plus size={12} /></button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-drawer__foot">
            <div className="cart-total"><span>Total:</span><span>{fmt(total)}</span></div>
            {!showForm ? (
              <button type="button" className="btn btn--gold" onClick={() => setShowForm(true)}>Realizar pedido</button>
            ) : (
              <div className="cart-form">
                <input className="input" placeholder="Tu nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input" placeholder="Tu ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
                <div className="row">
                  <button type="button" className="btn btn--gold" onClick={sendOrder}>Enviar por WhatsApp</button>
                  <button type="button" className="btn btn--line" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
      <ProductQuickView
        product={preview}
        onClose={() => setPreview(null)}
        onAdd={(p) => setCart((c) => {
          const ex = c.find((i) => i.id === p.id);
          if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
          return [...c, { ...p, qty: 1 }];
        })}
      />
    </>
  );
}
