import { useRef } from 'react';
import { WALK } from '../data';
import { useScrollFrame } from '../lib/scroll';

const GAP = 900; // distancia entre cuadros en el eje Z

/**
 * "Entra al club" — recorrido en 3D: la cámara avanza por un pasillo y los cuadros (fotos reales) pasan a los lados.
 * Todo es una sola transformación por cuadro, sin recargar el navegador.
 */
export default function Walk() {
  const sec = useRef(null);
  const frames = useRef([]);
  const caption = useRef(null);
  useScrollFrame(sec, (p, s) => {
    const total = (WALK.length - 1) * GAP + 600;
    const cam = p * total;
    const side = Math.min(s.vw * 0.26, 360);
    let best = 0, bd = 1e9;
    WALK.forEach((_, i) => {
      const el = frames.current[i];
      if (!el) return;
      const z = cam - i * GAP - 300; // posición relativa a la cámara
      const x = (i % 2 ? 1 : -1) * side * (0.35 + Math.min(1, Math.max(0, (z + 1400) / 1800)) * 0.9);
      const vis = z > -3200 && z < 700;
      el.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      const fade = z > 250 ? Math.max(0, 1 - (z - 250) / 400) : Math.min(1, (z + 3200) / 900);
      el.style.opacity = fade.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(i % 2 ? -1 : 1) * 18}deg)`;
      const d = Math.abs(z + 200);
      if (d < bd) { bd = d; best = i; }
    });
    if (caption.current && caption.current.dataset.i !== String(best)) {
      caption.current.dataset.i = String(best);
      caption.current.querySelector('b').textContent = WALK[best].t;
      caption.current.querySelector('span').textContent = WALK[best].s;
      caption.current.querySelector('em').textContent = `0${best + 1} / 0${WALK.length}`;
      caption.current.classList.remove('pop'); void caption.current.offsetWidth; caption.current.classList.add('pop');
    }
    sec.current.style.setProperty('--wp', p.toFixed(3));
  }, 'pin');
  return (
    <section id="club" ref={sec} className="walk">
      <div className="walk-sticky">
        <div className="walk-floor" aria-hidden="true" />
        <div className="walk-world">
          {WALK.map((w, i) => (
            <figure key={w.img} ref={(el) => { frames.current[i] = el; }} className="wframe">
              <img src={w.img} alt={w.t} loading="lazy" decoding="async" />
              <span className="wf-glow" />
            </figure>
          ))}
        </div>
        <div className="walk-head wrap">
          <p className="kicker">Entra al club</p>
          <h2 className="sec-title">Un lugar donde <span className="gold-text">te quieres quedar</span></h2>
        </div>
        <p ref={caption} className="walk-cap" data-i="0"><em>01 / 0{WALK.length}</em><b>{WALK[0].t}</b><span>{WALK[0].s}</span></p>
        <i className="walk-bar" aria-hidden="true" />
      </div>
    </section>
  );
}
