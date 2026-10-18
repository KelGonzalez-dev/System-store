import { useRef, useState } from 'react';
import { RITUAL } from '../data';
import { useScrollFrame } from '../lib/scroll';

/**
 * "El ritual VIP" (sección fija): las fotos se revelan dentro de un círculo que crece desde el centro,
 * una tras otra, mientras un anillo dorado marca el progreso y la lista de pasos avanza.
 */
export default function Ritual() {
  const sec = useRef(null);
  const imgs = useRef([]);
  const ring = useRef(null);
  const [cur, setCur] = useState(0);
  const c = useRef(0);
  const N = RITUAL.length;
  useScrollFrame(sec, (p) => {
    const f = p * N;
    RITUAL.forEach((_, i) => {
      const el = imgs.current[i];
      if (!el) return;
      const k = i === 0 ? 1 : Math.max(0, Math.min(1, (f - i + 0.35) / 0.55));
      el.style.clipPath = `circle(${(k * 75).toFixed(2)}% at 50% 50%)`;
      el.querySelector('img').style.transform = `scale(${(1.25 - k * 0.25).toFixed(3)})`;
    });
    if (ring.current) ring.current.style.strokeDashoffset = (1 - p).toFixed(4);
    const n = Math.min(N - 1, Math.floor(f + 0.2));
    if (n !== c.current) { c.current = n; setCur(n); }
  }, 'pin');
  return (
    <section id="ritual" ref={sec} className="ritual" style={{ '--n': N }}>
      <div className="ritual-sticky">
        <div className="wrap ritual-grid">
          <div className="r-copy">
            <p className="eyebrow"><span className="dot" /> El ritual VIP</p>
            <h2 className="sec-title">Así se vive <em>Jean Paul</em></h2>
            <ol className="r-steps">
              {RITUAL.map((r, i) => (
                <li key={r.t} className={i === cur ? 'on' : i < cur ? 'done' : ''}>
                  <span className="rs-n">{String(i + 1).padStart(2, '0')}</span>
                  <div><b>{r.t}</b><p>{r.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="r-lens" aria-hidden="true">
            <svg className="r-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48.5" pathLength="1" className="rr-bg" /><circle ref={ring} cx="50" cy="50" r="48.5" pathLength="1" className="rr-fg" /></svg>
            <div className="r-frame">
              {RITUAL.map((r, i) => <div key={r.t} ref={(el) => { imgs.current[i] = el; }} className="r-img"><img src={r.img} alt="" loading="lazy" /></div>)}
            </div>
            <span key={cur} className="r-label">{RITUAL[cur].t}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
