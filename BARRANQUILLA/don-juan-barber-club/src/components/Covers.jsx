import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG, COVERS } from '../data';
import { reducedMotion } from '../lib/scroll';

const N = COVERS.length;

/**
 * "Don Juan Magazine": cada visita es portada. Las fotos reales se presentan como portadas de revista
 * en un carrusel 3D: la del centro al frente y las demás en abanico. Pasa solo, se arrastra con el dedo
 * o con las flechas.
 */
export default function Covers() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const x0 = useRef(null);
  const go = useCallback((d) => setI((v) => (v + d + N) % N), []);
  useEffect(() => {
    if (reducedMotion() || hold) return undefined;
    const id = setInterval(() => go(1), 3800);
    return () => clearInterval(id);
  }, [go, hold]);
  return (
    <section id="fama" className="mag-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="text-center">
          <p className="kicker justify-center">La barbería de los famosos</p>
          <h2 className="rv mask-up sec-title"><span>Aquí cada cliente <span className="gold-text">es portada</span></span></h2>
        </div>
        <div className="mag-stage" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}
          onPointerDown={(e) => { x0.current = e.clientX; }}
          onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}>
          {COVERS.map((c, k) => {
            let d = k - i; if (d > N / 2) d -= N; if (d < -N / 2) d += N;
            const a = Math.abs(d);
            return (
              <figure key={c.img} className={`mag ${d === 0 ? 'on' : ''}`} onClick={() => d !== 0 && go(d)}
                style={{ '--d': d, '--a': a, zIndex: 20 - a, opacity: a > 3 ? 0 : 1, pointerEvents: a > 3 ? 'none' : 'auto' }} aria-hidden={d !== 0}>
                <img src={c.img} alt={c.h} loading="lazy" draggable="false" />
                <div className="mag-ui">
                  <p className="mag-mast">DON JUAN</p>
                  <p className="mag-issue">La barbería de los famosos · Edición BAQ · N.º {String(k + 1).padStart(2, '0')}</p>
                  <div className="mag-lines"><b>{c.h}</b><span>{c.s}</span></div>
                  <span className="mag-code" aria-hidden="true" />
                </div>
                <span className="mag-gloss" />
              </figure>
            );
          })}
        </div>
        <div className="mag-ctrl">
          <button type="button" className="round" onClick={() => go(-1)} aria-label="Anterior">←</button>
          <div className="mag-dots">{COVERS.map((_, k) => <button key={k} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Portada ${k + 1}`} />)}</div>
          <button type="button" className="round" onClick={() => go(1)} aria-label="Siguiente">→</button>
        </div>
        <div className="mt-8 flex justify-center"><a className="btn btn-glass" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Ver celebridades en @{CONFIG.instagram}</a></div>
      </div>
    </section>
  );
}
