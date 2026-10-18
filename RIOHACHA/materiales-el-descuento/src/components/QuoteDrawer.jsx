import { useEffect } from 'react';
import { CartIcon, WaIcon } from './Brand';
import { ProductImage, Qty } from './Product';
import { fmt, unitPrice, waLink } from '../data';
import { useQuote } from '../quote';
import { lockScroll } from '../lib/scroll';

// Cotización: lista, cantidades, precio por mayor automático, ahorro y envío por WhatsApp
export function QuoteDrawer() {
  const { list, total, saved, open, setOpen, setQty, clear, message } = useQuote();
  useEffect(() => { if (!open) return undefined; lockScroll(true); const k = (e) => e.key === 'Escape' && setOpen(false); document.addEventListener('keydown', k); return () => { lockScroll(false); document.removeEventListener('keydown', k); }; }, [open, setOpen]);
  return (
    <div className={`drawer ${open ? 'on' : ''}`} aria-hidden={!open} onClick={() => setOpen(false)}>
      <aside className="dr-panel" role="dialog" aria-modal="true" aria-label="Mi cotización" onClick={(e) => e.stopPropagation()}>
        <div className="dr-head"><h3><CartIcon /> Mi cotización</h3><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button></div>
        {list.length === 0 ? (
          <div className="dr-empty"><p>Tu cotización está vacía.</p><span>Agrega productos del catálogo o usa la calculadora de materiales.</span></div>
        ) : (
          <>
            <ul className="dr-list">
              {list.map(({ p, q }) => {
                const up = unitPrice(p, q);
                return (
                  <li key={p.id}>
                    <div className="dl-img"><ProductImage p={p} w={160} /></div>
                    <div className="dl-info">
                      <b>{p.n}</b><span>{p.brand} · {fmt.format(up)} / {p.unit}{q >= p.min ? <em> por mayor</em> : <small> (mayor desde {p.min})</small>}</span>
                      <div className="dl-row"><Qty q={q} setQ={(v) => setQty(p.id, v)} small /><strong>{fmt.format(up * q)}</strong></div>
                      <button type="button" className="dl-del" onClick={() => setQty(p.id, 0)}>Quitar</button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="dr-foot">
              {saved > 0 && <p className="dr-saved">Ahorras {fmt.format(saved)} por comprar al por mayor 🎉</p>}
              <div className="dr-total"><span>Total aproximado</span><b>{fmt.format(total)}</b></div>
              <a className="btn btn-wa w-full" href={waLink(message())} target="_blank" rel="noopener noreferrer"><WaIcon /> Enviar cotización por WhatsApp</a>
              <button type="button" className="dr-clear" onClick={clear}>Vaciar cotización</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function FloatQuote() {
  const { count, setOpen, bump } = useQuote();
  return (
    <div className="floats">
      {count > 0 && <button type="button" key={bump} className="fq" onClick={() => setOpen(true)}><CartIcon /> Cotización <em>{count}</em></button>}
      <a className="fwa" href={waLink('¡Hola! Quiero hacer un pedido / consulta.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WaIcon className="h-7 w-7" /></a>
    </div>
  );
}
