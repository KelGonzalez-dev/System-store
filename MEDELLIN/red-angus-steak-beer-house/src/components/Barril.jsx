import { useRef, useState } from 'react';
import { BARRIL } from '../data';
import { useScrollFrame } from '../lib/scroll';

/**
 * Beer House (sección fija): al bajar, el grifo sirve una pinta tras otra. Cada cerveza de barril
 * llena el vaso con su color (rubia, roja, negra, IPA), con burbujas y espuma.
 */
export default function Barril() {
  const sec = useRef(null);
  const [i, setI] = useState(0);
  const cur = useRef(0);
  useScrollFrame(sec, (p) => {
    const n = BARRIL.length;
    const f = Math.min(n - 0.001, p * n);
    const k = Math.floor(f);
    const llenado = Math.min(1, (f - k) / 0.7);
    sec.current?.style.setProperty('--nivel', (0.1 + llenado * 0.8).toFixed(3));
    sec.current?.style.setProperty('--chorro', llenado < 0.98 ? '1' : '0');
    if (k !== cur.current) { cur.current = k; setI(k); }
  }, 'pin');
  const b = BARRIL[i];
  return (
    <section id="barril" ref={sec} className="barril" style={{ '--cerveza': b.color, '--espuma': b.espuma }}>
      <div className="barril__sticky">
        <div className="wrap barril__grid">
          <div className="barril__copy">
            <p className="eyebrow">Beer House</p>
            <h2 className="titulo">Bien fría, <em>de barril.</em></h2>
            <ol className="barril__lista">
              {BARRIL.map((x, k) => (
                <li key={x.id} className={k === i ? 'on' : k < i ? 'ya' : ''}>
                  <span className="barril__punto" style={{ background: x.color }} />
                  <div><b>{x.nombre} <small>{x.estilo} · {x.abv}</small></b>{k === i && <p>{x.txt}</p>}</div>
                </li>
              ))}
            </ol>
          </div>
          <div className="pinta" aria-hidden="true">
            <svg className="grifo" viewBox="0 0 160 170">
              <rect x="20" y="0" width="120" height="30" rx="8" fill="#2A211D" />
              <rect x="64" y="30" width="32" height="70" rx="6" fill="#B08A4E" />
              <rect x="70" y="-60" width="20" height="80" rx="8" fill="#C8282E" transform="rotate(-14 80 20)" />
              <rect x="72" y="96" width="16" height="22" rx="4" fill="#8C6A36" />
            </svg>
            <span className="chorro" />
            <div className="vaso">
              <span className="vaso__cerveza"><i /><i /><i /><i /><i /><i /></span>
              <span className="vaso__espuma" />
              <span className="vaso__brillo" />
            </div>
            <span className="pinta__etiqueta" key={b.id}>{b.nombre}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
