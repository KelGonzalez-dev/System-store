import { useRef } from 'react';
import { Product } from './Bottles';
import { SHOP, fmt, waLink } from '../data';
import { useInView, useTilt } from '../lib/scroll';

function Item({ p, i }) {
  const ref = useRef(null);
  useTilt(ref, 10);
  return (
    <article ref={ref} className="shop-item" style={{ '--k': i, '--c': p.c }}>
      <div className="si-stage"><span className="si-spot" /><div className="si-turn"><Product kind={p.kind} c={p.c} /></div></div>
      <h3>{p.n}</h3>
      <p>{p.d}</p>
      <div className="si-foot">
        <b>{fmt.format(p.price)}</b>
        <a className="btn btn-glass !h-10 !px-4" href={waLink(`¡Hola Don Juan Barber Club! ⚜ Quiero apartar: ${p.n}.`)} target="_blank" rel="noopener noreferrer">Apartar</a>
      </div>
    </article>
  );
}

// Tienda para caballeros: productos sobre pedestales iluminados que giran al pasar el mouse
export default function Shop() {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section id="tienda" className="shop-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="svc-head">
          <div>
            <p className="kicker">Tienda Don Juan</p>
            <h2 className="rv mask-up sec-title"><span>Llévate el <span className="gold-text">estilo</span> a casa</span></h2>
          </div>
          <p className="max-w-[40ch] text-white/65">Productos profesionales para mantener el corte y la barba como recién salido del club. Apártalos y recógelos en tu próxima visita.</p>
        </div>
        <div ref={ref} className={`shop-grid ${seen ? 'in' : ''}`}>{SHOP.map((p, i) => <Item key={p.id} p={p} i={i} />)}</div>
        <p className="mt-6 text-[13px] text-white/40">Productos y precios de referencia: actualízalos con los que vende el club.</p>
      </div>
    </section>
  );
}
