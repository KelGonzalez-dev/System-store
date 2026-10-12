import { useRef } from 'react';
import Art from './Art';
import { AddButton } from './Product';
import { PRODUCTS, fmt, waLink } from '../data';
import { clamp, ease, useScrollFrame } from '../lib/scroll';

const KITS = PRODUCTS.filter((p) => p.cat === 'kits');
const POP = [1, 12, 17, 6].map((id) => PRODUCTS.find((p) => p.id === id));
const SPARKS = Array.from({ length: 18 }, (_, i) => ({ a: (i / 18) * 360 + (i % 3) * 7, d: 0.6 + (i % 5) * 0.12, c: ['#c9a25f', '#e9c9b9', '#c8693f', '#7c9a7e'][i % 4] }));

/**
 * Caja de regalo 3D (sección fija). Al bajar:
 * 1) la caja gira y se acerca, 2) el lazo se suelta, 3) la tapa se levanta HACIA ARRIBA y hacia atrás,
 * 4) sale luz desde adentro con destellos, 5) los productos suben uno a uno desde la caja.
 */
export default function GiftBox() {
  const sec = useRef(null);
  useScrollFrame(sec, (p) => {
    const el = sec.current;
    if (!el) return;
    el.style.setProperty('--bow', ease(clamp((p - 0.08) / 0.14)).toFixed(3));
    el.style.setProperty('--open', ease(clamp((p - 0.18) / 0.3)).toFixed(3));
    el.style.setProperty('--glow', clamp((p - 0.3) / 0.2).toFixed(3));
    el.style.setProperty('--pop', clamp((p - 0.4) / 0.4).toFixed(3));
    el.style.setProperty('--spin', (-34 + p * 46).toFixed(2));
  }, 'pin');
  return (
    <section id="regalos" ref={sec} className="gift">
      <div className="gift-sticky">
        <div className="wrap gift-grid">
          <div className="gift-text">
            <p className="eyebrow">Para regalar</p>
            <h2 className="sec-title">Un detalle que <em>enamora</em></h2>
            <p className="gift-lead">Armo kits a tu medida para cumpleaños, aniversarios, Día de la Madre, Amor y Amistad o Navidad: caja, lazo y tarjeta incluidos.</p>
            <ul className="kits">
              {KITS.map((k) => <li key={k.id}><div><b>{k.name}</b><span>{k.size}</span></div><em>{fmt.format(k.price)}</em><AddButton p={k} compact /></li>)}
            </ul>
            <a className="btn btn-line mt-4" href={waLink('¡Hola Zulima! 🎁 Quiero armar un kit de regalo personalizado.')} target="_blank" rel="noopener noreferrer">Armar un kit a mi medida</a>
          </div>
          <div className="box-stage" aria-hidden="true">
            <div className="box-shadow" />
            <div className="beam" />
            <div className="sparks">{SPARKS.map((s, i) => <i key={i} style={{ '--a': `${s.a}deg`, '--d': s.d, '--c': s.c }} />)}</div>
            <div className="box3d">
              {/* interior (más oscuro) */}
              <div className="bx in-front" /><div className="bx in-back" /><div className="bx in-left" /><div className="bx in-right" /><div className="bx in-bottom" />
              {/* exterior */}
              <div className="bx f-front"><i className="rib-v" /></div>
              <div className="bx f-back"><i className="rib-v" /></div>
              <div className="bx f-left"><i className="rib-v" /></div>
              <div className="bx f-right"><i className="rib-v" /></div>
              <div className="bx f-bottom" />
              <div className="tissue"><i /><i /><i /></div>
              <div className="pop-items">{POP.map((p, i) => <div key={p.id} className={`pop p${i}`} style={{ '--i': i }}><Art art={p.art} label={p.line} /></div>)}</div>
              {/* tapa: gira sobre el borde trasero hacia arriba */}
              <div className="lid">
                <div className="lid-top"><i className="rib-v" /><i className="rib-h" /></div>
                <div className="lid-under" />
                <div className="lid-side ls-front" /><div className="lid-side ls-back" /><div className="lid-side ls-left" /><div className="lid-side ls-right" />
                <div className="bow"><i className="loop l" /><i className="loop r" /><i className="knot" /><i className="tail tl" /><i className="tail tr" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
