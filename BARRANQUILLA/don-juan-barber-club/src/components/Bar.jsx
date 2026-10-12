import { useRef, useState } from 'react';
import { Bottle } from './Bottles';
import { L, SHELF } from '../data';
import { useInView } from '../lib/scroll';

/**
 * El bar: estantería retroiluminada con seis botellas (cervezas, ron, tequila, whisky, granizados y snacks)
 * que suben una por una; al tocar una, se levanta, brilla con su color y muestra lo que hay.
 */
export default function Bar() {
  const sec = useRef(null);
  const lit = useInView(sec);
  const [sel, setSel] = useState(0);
  const cur = SHELF[sel];
  return (
    <section id="bar" ref={sec} className={`bar-sec ${lit ? 'lit' : ''}`} style={{ '--glow': cur.color }}>
      <div className="bar-photo" aria-hidden="true"><img src={L.bar} alt="" loading="lazy" /></div>
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="bar-top">
          <div>
            <p className="kicker">Don Juan Social Club</p>
            <h2 className="bar-neon" aria-label="El bar"><span>El</span> <span>bar</span></h2>
          </div>
          <p className="bar-lead">Cerveza, ron, tequila, whisky, granizados y snacks. <b className="text-gold">Tu primera bebida va por la casa</b> y la charla, también.</p>
        </div>
        <div className="shelf" role="tablist" aria-label="Carta del bar">
          {SHELF.map((b, i) => (
            <button key={b.id} type="button" role="tab" aria-selected={i === sel} className={`bt ${i === sel ? 'on' : ''}`} style={{ '--c': b.color, '--i': i }} onClick={() => setSel(i)}>
              <span className="bt-glow" />
              <Bottle id={b.id} color={b.color} />
              <span className="bt-n">{b.n}</span>
            </button>
          ))}
          <i className="shelf-board" aria-hidden="true" />
        </div>
        <div key={cur.id} className="bar-card">
          <div><b>{cur.n}</b><span>{cur.d}</span></div>
          <ul>{cur.items.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="promo-row">
          <span className="promo">🥃 Shot de bienvenida</span><span className="promo">🍺 Trago de cortesía</span><span className="promo">📺 Pantallas con fútbol en vivo</span><span className="promo">🎁 Obsequio de bienvenida</span>
        </div>
        <p className="mt-6 text-[12px] text-white/40">Venta de bebidas alcohólicas solo para mayores de 18 años. El exceso de alcohol es perjudicial para la salud.</p>
      </div>
    </section>
  );
}
