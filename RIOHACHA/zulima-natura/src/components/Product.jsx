import { useEffect, useRef, useState } from 'react';
import Art from './Art';
import Photo from './Photo';
import { FAMILIES, PRODUCTS, fmt } from '../data';
import { useBag } from '../bag';
import { toggleWish, useWish } from '../wish';
import { lockScroll, useTilt } from '../lib/scroll';

export const FOR_LABEL = { ella: 'Para ella', el: 'Para él', all: 'Unisex' };

export function AddButton({ p, compact = false }) {
  const { add } = useBag();
  const [ok, setOk] = useState(false);
  const click = (e) => { e.stopPropagation(); add(p.id); setOk(true); setTimeout(() => setOk(false), 1300); };
  return (
    <button type="button" className={`add-btn ${ok ? 'ok' : ''} ${compact ? 'compact' : ''}`} onClick={click} aria-label={`Agregar ${p.name} a la bolsa`}>
      {ok ? '✓' : compact ? <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg> : 'Agregar a la bolsa'}
    </button>
  );
}

export function Heart({ id }) {
  const w = useWish();
  const on = w.includes(id);
  return (
    <button type="button" className={`heart ${on ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(id); }} aria-pressed={on} aria-label={on ? 'Quitar de mis favoritos' : 'Guardar en mis favoritos'}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-9.3-9A5 5 0 0 1 12 5.6 5 5 0 0 1 21.3 11C19 15.5 12 20 12 20z" /></svg>
    </button>
  );
}

export function ProductCard({ p, i = 0, onOpen }) {
  const ref = useRef(null);
  useTilt(ref, 6);
  return (
    <article ref={ref} className="pcard" style={{ '--k': i, '--c': p.art.c }} onClick={() => onOpen(p)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}>
      <div className="pc-media">
        <Photo id={p.img} art={p.art} label={p.line} alt={p.name} className="pc-photo" />
        <div className="pc-alt" aria-hidden="true"><span className="pc-blob" /><Art art={p.art} label={p.line} /></div>
        <div className="pc-badges">{p.fav && <span className="bd-fav">★ Favorito</span>}{p.oldPrice && <span className="bd-off">Oferta</span>}</div>
        <Heart id={p.id} />
        <span className="pc-quick">Vista rápida</span>
        <span className="glare" />
      </div>
      <div className="pc-body">
        <span className="pc-tag">{p.line} · {FOR_LABEL[p.for]}</span>
        <h3>{p.name}</h3>
        <p className="pc-size">{p.size}</p>
        <div className="pc-foot">
          <div className="pc-price">{p.oldPrice && <s>{fmt.format(p.oldPrice)}</s>}<b>{fmt.format(p.price)}</b></div>
          <AddButton p={p} compact />
        </div>
      </div>
    </article>
  );
}

// Ficha: foto e ilustración, detalles, cantidad y productos relacionados
export function ProductModal({ p, onClose, onOpen }) {
  const { add, setOpen } = useBag();
  const [view, setView] = useState(0);
  const [q, setQ] = useState(1);
  useEffect(() => {
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [onClose]);
  useEffect(() => { setView(0); setQ(1); }, [p.id]);
  const related = PRODUCTS.filter((x) => x.id !== p.id && (x.line === p.line || x.cat === p.cat)).slice(0, 4);
  const buy = () => { for (let i = 0; i < q; i++) add(p.id); onClose(); setOpen(true); };
  return (
    <div className="pmodal" role="dialog" aria-modal="true" aria-label={p.name} onClick={onClose}>
      <div key={p.id} className="pm-card" onClick={(e) => e.stopPropagation()} style={{ '--c': p.art.c }}>
        <button type="button" className="pm-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="pm-media">
          <div className={`pm-view ${view === 0 ? 'on' : ''}`}><Photo id={p.img} art={p.art} label={p.line} alt={p.name} w={1000} eager /></div>
          <div className={`pm-view art-view ${view === 1 ? 'on' : ''}`}><Art art={p.art} label={p.line} /></div>
          <div className="pm-thumbs">
            <button type="button" className={view === 0 ? 'on' : ''} onClick={() => setView(0)} aria-label="Ver foto"><Photo id={p.img} art={p.art} w={200} /></button>
            <button type="button" className={view === 1 ? 'on' : ''} onClick={() => setView(1)} aria-label="Ver ilustración"><Art art={p.art} /></button>
          </div>
          <Heart id={p.id} />
        </div>
        <div className="pm-body">
          <span className="pc-tag">{p.line} · {FOR_LABEL[p.for]}</span>
          <h3>{p.name}</h3>
          <p className="pc-size">{p.size}</p>
          <div className="pc-price pm-price">{p.oldPrice && <s>{fmt.format(p.oldPrice)}</s>}<b>{fmt.format(p.price)}</b></div>
          <p className="pm-desc">{p.desc}</p>
          {p.family && (
            <div className="pm-notes">
              <div><span>Familia</span><b>{FAMILIES[p.family]}</b></div>
              <div><span>Notas</span><b>{p.notes}</b></div>
            </div>
          )}
          <div className="pm-buy">
            <div className="qty big"><button type="button" onClick={() => setQ(Math.max(1, q - 1))} aria-label="Menos">−</button><span>{q}</span><button type="button" onClick={() => setQ(q + 1)} aria-label="Más">+</button></div>
            <button type="button" className="btn btn-terra flex-1" onClick={buy}>Agregar · {fmt.format(p.price * q)}</button>
          </div>
          <ul className="pm-perks"><li>🚚 Entrega a domicilio</li><li>💬 Asesoría personalizada</li><li>🎁 Te lo envuelvo para regalo</li></ul>
          {related.length > 0 && (
            <div className="pm-related">
              <b>También te puede gustar</b>
              <div>{related.map((r) => <button key={r.id} type="button" onClick={() => onOpen(r)}><Photo id={r.img} art={r.art} label={r.line} w={240} /><span>{r.name}</span><em>{fmt.format(r.price)}</em></button>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
