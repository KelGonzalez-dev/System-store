import { useEffect, useState } from 'react';
import Art from './Art';
import Photo from './Photo';
import { WaIcon } from './Brand';
import { CATS, PRODUCTS, fmt, unitPrice, waLink } from '../data';
import { useQuote } from '../quote';
import { lockScroll } from '../lib/scroll';

const plural = (u, q) => (q === 1 || /m|²|³/.test(u) ? u : `${u}s`);

export function Qty({ q, setQ, small = false }) {
  return (
    <div className={`qty ${small ? 'sm' : ''}`}>
      <button type="button" onClick={(e) => { e.stopPropagation(); setQ(Math.max(1, q - 1)); }} aria-label="Menos">−</button>
      <input value={q} inputMode="numeric" onClick={(e) => e.stopPropagation()} onChange={(e) => setQ(Math.max(1, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1))} aria-label="Cantidad" />
      <button type="button" onClick={(e) => { e.stopPropagation(); setQ(q + 1); }} aria-label="Más">+</button>
    </div>
  );
}

export function ProductImage({ p, w = 500 }) {
  return p.img ? <Photo src={p.img} art={p.art} w={w} alt={p.n} /> : <div className="pimg"><Art art={p.art} /></div>;
}

export function ProductCard({ p, i = 0, onOpen }) {
  const { add } = useQuote();
  const [q, setQ] = useState(1);
  const [ok, setOk] = useState(false);
  const isMayor = q >= p.min;
  const addIt = (e) => { e.stopPropagation(); add(p.id, q); setOk(true); setTimeout(() => setOk(false), 1200); };
  return (
    <article className="pcard" style={{ '--k': i }} onClick={() => onOpen(p)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}>
      <div className="pc-img">
        <ProductImage p={p} />
        <div className="pc-badges">{p.top && <span className="bd-top">Más vendido</span>}{p.isNew && <span className="bd-new">Nuevo</span>}</div>
        <span className="pc-save">Ahorra {Math.round((1 - p.mayor / p.detal) * 100)}% por mayor</span>
      </div>
      <div className="pc-body">
        <span className="pc-brand">{p.brand}</span>
        <h3>{p.n}</h3>
        <span className="pc-unit">Precio por {p.unit}</span>
        <div className="prices">
          <div className={`pr ${!isMayor ? 'on' : ''}`}><small>Detal</small><b>{fmt.format(p.detal)}</b></div>
          <div className={`pr mayor ${isMayor ? 'on' : ''}`}><small>Por mayor · desde {p.min}</small><b>{fmt.format(p.mayor)}</b></div>
        </div>
        <div className="pc-buy" onClick={(e) => e.stopPropagation()}>
          <Qty q={q} setQ={setQ} small />
          <button type="button" className={`add ${ok ? 'ok' : ''}`} onClick={addIt}>{ok ? '✓ Agregado' : 'Agregar'}</button>
        </div>
        <p className="pc-total">{q} {plural(p.unit, q)} = <b>{fmt.format(unitPrice(p, q) * q)}</b>{isMayor && <em> · precio por mayor</em>}</p>
      </div>
    </article>
  );
}

export function ProductRow({ p, onOpen }) {
  const { add } = useQuote();
  const [ok, setOk] = useState(false);
  return (
    <tr onClick={() => onOpen(p)}>
      <td className="tr-img"><ProductImage p={p} w={120} /></td>
      <td><b>{p.n}</b><small>{p.brand}</small></td>
      <td className="t-unit">{p.unit}</td>
      <td className="t-price">{fmt.format(p.detal)}</td>
      <td className="t-price mayor">{fmt.format(p.mayor)}<small>desde {p.min}</small></td>
      <td><button type="button" className={`add sm ${ok ? 'ok' : ''}`} onClick={(e) => { e.stopPropagation(); add(p.id, 1); setOk(true); setTimeout(() => setOk(false), 1000); }}>{ok ? '✓' : '+'}</button></td>
    </tr>
  );
}

export function ProductModal({ p, onClose, onOpen }) {
  const { add, setOpen } = useQuote();
  const [q, setQ] = useState(1);
  useEffect(() => { setQ(1); }, [p.id]);
  useEffect(() => {
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [onClose]);
  const cat = CATS.find((c) => c.id === p.cat);
  const price = unitPrice(p, q);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const faltan = p.min - q;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={p.n} onClick={onClose}>
      <div key={p.id} className="md-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="md-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="md-img"><ProductImage p={p} w={900} /></div>
        <div className="md-body">
          <p className="md-crumb">{cat.n} · {p.brand}</p>
          <h3>{p.n}</h3>
          <p className="md-unit">Unidad de venta: <b>{p.unit}</b></p>
          <table className="tiers">
            <thead><tr><th>Cantidad</th><th>Precio por {p.unit}</th></tr></thead>
            <tbody>
              <tr className={q < p.min ? 'on' : ''}><td>1 a {p.min - 1}</td><td>{fmt.format(p.detal)} <small>detal</small></td></tr>
              <tr className={q >= p.min ? 'on' : ''}><td>{p.min} o más</td><td>{fmt.format(p.mayor)} <small>por mayor</small></td></tr>
            </tbody>
          </table>
          <div className="md-buy">
            <Qty q={q} setQ={setQ} />
            <div className="md-total"><small>Total</small><b>{fmt.format(price * q)}</b></div>
          </div>
          {faltan > 0 && faltan <= p.min * 0.5 && <p className="md-hint">💡 Te faltan <b>{faltan}</b> para el precio por mayor y ahorrarías {fmt.format((p.detal - p.mayor) * p.min)}.</p>}
          {q >= p.min && <p className="md-hint ok">✓ Estás pagando precio por mayor: ahorras {fmt.format((p.detal - p.mayor) * q)}.</p>}
          <div className="md-actions">
            <button type="button" className="btn btn-red" onClick={() => { add(p.id, q); onClose(); setOpen(true); }}>Agregar a cotización</button>
            <a className="btn btn-wa" href={waLink(`¡Hola! Quiero consultar: ${q} ${plural(p.unit, q)} de ${p.n} (${p.brand}).`)} target="_blank" rel="noopener noreferrer"><WaIcon /> Preguntar</a>
          </div>
          {related.length > 0 && (
            <div className="md-related"><b>Más en {cat.n}</b>
              <div>{related.map((r) => <button key={r.id} type="button" onClick={() => onOpen(r)}><ProductImage p={r} w={200} /><span>{r.n}</span><em>{fmt.format(r.detal)}</em></button>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
