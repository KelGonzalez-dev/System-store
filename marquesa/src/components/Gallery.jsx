import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { GALLERY, U } from '../data';
import { useI18n } from '../i18n';
import { clamp, lockScroll, reducedMotion, useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;
// posición de cada foto en el túnel (x en vw, y en vh): se alternan a los lados del camino
const SPOTS = [[-24, -6], [22, 8], [-6, -14], [28, -10], [-30, 10], [8, 12], [-18, -12], [26, 4], [-26, 2], [12, -14], [-10, 12], [22, -4]];

// Visor: las fotos están apiladas en profundidad; al avanzar, la actual vuela hacia ti y llega la siguiente desde el fondo
function Viewer({ start, onClose }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(start);
  const x0 = useRef(null);
  const swiped = useRef(false);
  const go = useCallback((d) => setPos((p) => clamp(p + d, 0, N - 1)), []);
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', key);
    lockScroll(true);
    return () => { document.removeEventListener('keydown', key); lockScroll(false); };
  }, [onClose, go]);
  const stop = (e) => e.stopPropagation();
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={t.gal.title}
      onClick={() => { if (swiped.current) { swiped.current = false; return; } onClose(); }}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => {
        if (x0.current === null) return;
        const dx = e.clientX - x0.current; x0.current = null;
        if (Math.abs(dx) > 45) { swiped.current = true; go(dx < 0 ? 1 : -1); }
      }}
    >
      <div className="viewer-stage">
        {GALLERY.map((id, i) => {
          const d = i - pos;
          if (d < -1 || d > 3) return null;
          const style = d < 0
            ? { transform: 'translate3d(0,0,520px) rotateX(-6deg)', opacity: 0 }
            : { transform: `translate3d(${d * 7}%,${-d * 5}%,${-d * 380}px) rotateZ(${d % 2 ? 3 : -3}deg)`, opacity: d === 0 ? 1 : 0.55 - d * 0.12, zIndex: 10 - d };
          return (
            <div key={id + i} className={`viewer-card ${d === 0 ? 'is-on' : ''}`} style={style} onClick={(e) => { stop(e); if (!swiped.current && d > 0) go(d); }}>
              <img src={U(id, 1400)} alt="" draggable="false" />
            </div>
          );
        })}
      </div>
      <p className="viewer-count font-display">{String(pos + 1).padStart(2, '0')}<span> / {String(N).padStart(2, '0')}</span></p>
      <button type="button" className="lb-btn right-5 top-[calc(16px+env(safe-area-inset-top,0px))]" onClick={(e) => { stop(e); onClose(); }} aria-label={t.gal.close}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="1.8"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
      <button type="button" disabled={pos === 0} className="lb-btn left-3 top-1/2 -translate-y-1/2 md:left-8" aria-label="←" onClick={(e) => { stop(e); go(-1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" disabled={pos === N - 1} className="lb-btn right-3 top-1/2 -translate-y-1/2 md:right-8" aria-label="→" onClick={(e) => { stop(e); go(1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

// Galería en túnel 3D: al hacer scroll avanzas hacia el fondo y las fotos pasan a tu lado
export default function Gallery() {
  const { t } = useI18n();
  const sec = useRef(null);
  const world = useRef(null);
  const title = useRef(null);
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);

  useScrollFrame(sec, (p, s) => {
    const D = s.vw < 768 ? 430 : 560;
    const cam = p * (N + 1.4) * D;
    world.current.style.transform = `translate3d(0,0,${cam}px)`;
    const items = world.current.children;
    for (let i = 0; i < items.length; i++) {
      const z = -(i + 2) * D + cam; // posición respecto a la cámara
      const o = z > 160 ? 0 : z > -120 ? clamp((160 - z) / 280) : clamp((z + 4 * D) / D);
      items[i].style.opacity = o.toFixed(3);
      items[i].style.pointerEvents = o > 0.4 ? 'auto' : 'none';
    }
    title.current.style.opacity = (1 - clamp(p / 0.12)).toFixed(3);
    title.current.style.transform = `translate3d(0,0,${p * 2400}px)`;
  }, 'pin');

  return (
    <section id="galeria" ref={sec} className="relative h-[460svh] bg-noche">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="tunnel-glow" aria-hidden="true" />
        <div className="tunnel">
          <div ref={title} className="tunnel-title">
            <h2 className="sec-title text-hueso">{t.gal.title}</h2>
            <p className="font-script text-[clamp(30px,3.4vw,48px)] text-neon">{t.gal.lead}</p>
            <p className="mt-6 text-[13px] uppercase tracking-[0.3em] text-hueso/50">{t.gal.hint} ↓</p>
          </div>
          <div ref={world} className="tunnel-world">
            {GALLERY.map((id, i) => {
              const [x, y] = SPOTS[i % SPOTS.length];
              return (
                <button type="button" key={id + i} className="tunnel-card" aria-label={`${t.gal.title} ${i + 1}`} onClick={() => setOpen(i)}
                  style={{ '--x': x, '--y': y, '--z': i + 2, opacity: reducedMotion() ? 1 : 0 }}>
                  <Img id={id} w={700} sizes="(max-width: 768px) 60vw, 28vw" className="h-full w-full" alt="" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {open >= 0 && <Viewer start={open} onClose={close} />}
    </section>
  );
}
