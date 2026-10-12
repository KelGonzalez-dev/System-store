import { useRef, useState } from 'react';
import Photo from './Photo';
import { AddButton } from './Product';
import { MOOD, PRODUCTS, fmt } from '../data';
import { useScrollFrame } from '../lib/scroll';

const STEPS = [
  { n: 'Limpia', d: 'Empieza con jabones de origen vegetal que cuidan tu piel mientras la limpian.', ids: [20, 22] },
  { n: 'Hidrata', d: 'Cremas y pulpas que nutren de verdad y dejan un aroma que dura todo el día.', ids: [12, 17] },
  { n: 'Perfuma', d: 'El toque final: tu fragancia favorita para salir a conquistar el día.', ids: [6, 1] },
];

// "Tu ritual" (sección fija): tres tarjetas apiladas; al bajar, cada una se voltea en 3D y deja ver la siguiente
export default function Ritual() {
  const sec = useRef(null);
  const [cur, setCur] = useState(0);
  const c = useRef(0);
  useScrollFrame(sec, (p) => {
    const el = sec.current;
    if (!el) return;
    el.style.setProperty('--rp', p.toFixed(3));
    const n = Math.min(2, Math.floor(p * 3));
    if (n !== c.current) { c.current = n; setCur(n); }
  }, 'pin');
  return (
    <section id="ritual" ref={sec} className="ritual">
      <div className="ritual-sticky">
        <div className="wrap ritual-grid">
          <div>
            <p className="eyebrow">Tu ritual de cuidado</p>
            <h2 className="sec-title">Tres pasos, <em>cero</em> complicaciones</h2>
            <ol className="r-steps">{STEPS.map((s, i) => <li key={s.n} className={i === cur ? 'on' : i < cur ? 'done' : ''}><span>{i + 1}</span>{s.n}</li>)}</ol>
          </div>
          <div className="r-stack">
            {STEPS.map((s, i) => (
              <article key={s.n} className="r-card" style={{ '--i': i }}>
                <div className="rc-photo"><Photo id={MOOD.ritual[i]} art={PRODUCTS.find((p) => p.id === s.ids[0]).art} w={900} /><span className="rc-num">0{i + 1}</span></div>
                <div className="rc-body">
                  <h3>{s.n}</h3>
                  <p>{s.d}</p>
                  <ul>
                    {s.ids.map((id) => { const p = PRODUCTS.find((x) => x.id === id); return <li key={id}><span>{p.name}</span><em>{fmt.format(p.price)}</em><AddButton p={p} compact /></li>; })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
