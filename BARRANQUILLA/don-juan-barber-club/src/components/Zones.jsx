import { useRef } from 'react';
import Photo from './Photo';
import { ZONES } from '../data';
import { useScrollFrame } from '../lib/scroll';

/**
 * "El club por dentro": sección fija con desplazamiento horizontal. Cada zona es un panel grande
 * que gira en 3D al entrar y salir del centro; la foto se mueve dentro del marco (paralaje).
 */
export default function Zones() {
  const sec = useRef(null);
  const track = useRef(null);
  useScrollFrame(sec, (p, s) => {
    const tr = track.current;
    if (!tr) return;
    const max = tr.scrollWidth - s.vw;
    const x = -p * Math.max(0, max);
    tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    const mid = s.vw / 2;
    for (const el of tr.children) {
      const c = el.offsetLeft + x + el.offsetWidth / 2;
      const d = Math.max(-1.4, Math.min(1.4, (c - mid) / s.vw));
      el.style.transform = `rotateY(${(-d * 28).toFixed(2)}deg) translateZ(${(-Math.abs(d) * 220).toFixed(0)}px)`;
      el.style.setProperty('--d', d.toFixed(3));
    }
    sec.current.style.setProperty('--zp', p.toFixed(3));
  }, 'pin');
  return (
    <section id="club" ref={sec} className="zones" style={{ '--n': ZONES.length }}>
      <div className="zones-sticky">
        <div className="wrap zones-head">
          <p className="kicker">El club por dentro</p>
          <h2 className="sec-title">Todo lo que pasa <span className="gold-text">en Don Juan</span></h2>
        </div>
        <div ref={track} className="zones-track">
          {ZONES.map((z, i) => (
            <article key={z.id} className="zone">
              <div className="zn-photo"><Photo src={z.img} alt={z.t} w={1100} /></div>
              <div className="zn-body">
                <span className="zn-n">0{i + 1}</span>
                <span className="zn-ic" aria-hidden="true">{z.icon}</span>
                <p className="zn-k">{z.k}</p>
                <h3>{z.t}</h3>
                <p className="zn-d">{z.d}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="zones-bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
