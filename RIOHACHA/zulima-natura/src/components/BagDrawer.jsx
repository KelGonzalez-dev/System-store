import { useEffect } from 'react';
import Photo from './Photo';
import { BagIcon } from './Nav';
import { fmt } from '../data';
import { useBag } from '../bag';
import { lockScroll } from '../lib/scroll';

export function BagDrawer() {
  const { list, total, open, setOpen, setQty, send, clear } = useBag();
  useEffect(() => { if (!open) return undefined; lockScroll(true); const k = (e) => e.key === 'Escape' && setOpen(false); document.addEventListener('keydown', k); return () => { lockScroll(false); document.removeEventListener('keydown', k); }; }, [open, setOpen]);
  return (
    <div className={`bag ${open ? 'on' : ''}`} aria-hidden={!open} onClick={() => setOpen(false)}>
      <aside className="bag-panel" role="dialog" aria-modal="true" aria-label="Tu bolsa" onClick={(e) => e.stopPropagation()}>
        <div className="bag-head"><h3><BagIcon /> Tu bolsa</h3><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button></div>
        {list.length === 0 ? (
          <p className="bag-empty">Tu bolsa está vacía. Agrega tus favoritos del catálogo 🌿</p>
        ) : (
          <>
            <ul className="bag-list">
              {list.map(({ p, q }) => (
                <li key={p.id}>
                  <div className="bl-art"><Photo id={p.img} art={p.art} label={p.line} w={200} /></div>
                  <div className="bl-info"><b>{p.name}</b><span>{p.size}</span><em>{fmt.format(p.price * q)}</em></div>
                  <div className="qty"><button type="button" onClick={() => setQty(p.id, q - 1)} aria-label="Quitar uno">−</button><span>{q}</span><button type="button" onClick={() => setQty(p.id, q + 1)} aria-label="Agregar uno">+</button></div>
                </li>
              ))}
            </ul>
            <div className="bag-foot">
              <div className="bag-total"><span>Total aproximado</span><b>{fmt.format(total)}</b></div>
              <button type="button" className="btn btn-wa w-full" onClick={send}>Enviar pedido por WhatsApp</button>
              <button type="button" className="bag-clear" onClick={clear}>Vaciar bolsa</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function FloatBag() {
  const { count, setOpen, pulse } = useBag();
  if (!count) return null;
  return <button type="button" key={pulse} className="float-bag" onClick={() => setOpen(true)} aria-label="Ver mi bolsa"><BagIcon /><span>{count}</span></button>;
}
