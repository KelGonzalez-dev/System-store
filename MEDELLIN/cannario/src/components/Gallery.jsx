import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { GALLERY, U } from '../data';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion, useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;
const STEP = 360 / N;
const mod = (n) => ((n % N) + N) % N;

// Visor a pantalla completa: las fotos viven en un anillo 3D igual al de la galería
// y las flechas, el teclado o el deslizamiento lo hacen girar foto por foto.
function Viewer({ start, onClose }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(start); // contador continuo: siempre gira por el camino corto
  const seen = useRef(new Set());
  const x0 = useRef(null);
  const swiped = useRef(false);
  const idx = mod(pos);

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPos((p) => p + 1);
      if (e.key === 'ArrowLeft') setPos((p) => p - 1);
    };
    document.addEventListener('keydown', key);
    lockScroll(true);
    return () => { document.removeEventListener('keydown', key); lockScroll(false); };
  }, [onClose]);

  const stop = (e) => e.stopPropagation();
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={t.gal.title}
      onClick={() => { if (swiped.current) { swiped.current = false; return; } onClose(); }}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => {
        if (x0.current === null) return;
        const dx = e.clientX - x0.current; x0.current = null;
        if (Math.abs(dx) > 45) { swiped.current = true; setPos((p) => p + (dx < 0 ? 1 : -1)); }
      }}
    >
      <div className="viewer-stage">
        <div className="viewer-ring" style={{ transform: `translate3d(0,0,calc(var(--VR) * -1)) rotateY(${-pos * STEP}deg)` }}>
          {GALLERY.map((id, i) => {
            let d = mod(i - pos); if (d > N / 2) d -= N;
            const near = Math.abs(d) <= 2;
            if (near) seen.current.add(i);
            const c = Math.cos((d * STEP * Math.PI) / 180);
            const op = d === 0 ? 1 : Math.max(0, c * 1.4 - 0.62);
            return (
              <div key={id + i} className={`viewer-card ${d === 0 ? 'is-on' : ''}`}
                style={{ transform: `rotateY(${i * STEP}deg) translate3d(0,0,var(--VR))`, opacity: op, pointerEvents: op > 0.05 ? 'auto' : 'none' }}
                onClick={(e) => { stop(e); if (swiped.current) { swiped.current = false; return; } if (d !== 0) setPos((p) => p + d); }}
              >
                {seen.current.has(i) && <img src={U(id, 1400)} alt="" decoding="async" draggable="false" />}
              </div>
            );
          })}
        </div>
      </div>

      <p className="viewer-count" aria-live="polite">{String(idx + 1).padStart(2, '0')} <span>/ {String(N).padStart(2, '0')}</span></p>
      <button type="button" className="lb-btn right-5 top-[calc(16px+env(safe-area-inset-top,0px))]" onClick={(e) => { stop(e); onClose(); }} aria-label={t.gal.close}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="1.3"><path d="M5 5l14 14M19 5L5 19" /></svg>
      </button>
      <button type="button" className="lb-btn left-3 top-1/2 -translate-y-1/2 md:left-8" aria-label="←" onClick={(e) => { stop(e); setPos((p) => p - 1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.3"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className="lb-btn right-3 top-1/2 -translate-y-1/2 md:right-8" aria-label="→" onClick={(e) => { stop(e); setPos((p) => p + 1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.3"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

// Galería en anillo 3D: las fotos rodean un cilindro que gira con el scroll (y se puede arrastrar).
// Solo se mueve UN transform por frame (el del anillo), así que es muy liviano.
export default function Gallery() {
  const { t } = useI18n();
  const sec = useRef(null);
  const ring = useRef(null);
  const st = useRef({ target: 0, cur: 0, drag: 0, raf: 0, tilt: 0 });
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);

  const render = () => {
    const s = st.current;
    s.raf = 0;
    const goal = s.target + s.drag;
    s.cur += (goal - s.cur) * (reducedMotion() ? 1 : 0.16); // inercia suave
    const vel = goal - s.cur;
    s.tilt += (Math.max(-6, Math.min(6, vel * 0.25)) - s.tilt) * 0.1;
    ring.current.style.transform = `translate3d(0,0,calc(var(--R) * -1)) rotateX(${-4 + s.tilt * 0.4}deg) rotateY(${s.cur}deg)`;
    // las fotos se atenúan al girar hacia atrás: da profundidad y oculta las caras traseras
    const cards = ring.current.children;
    for (let i = 0; i < cards.length; i++) {
      const c = Math.cos(((i * STEP + s.cur) * Math.PI) / 180);
      cards[i].style.opacity = Math.max(0, Math.min(1, c * 2.2 - 0.05)).toFixed(3);
      cards[i].style.visibility = c < 0.04 ? 'hidden' : 'visible';
    }
    if (Math.abs(vel) > 0.02 || Math.abs(s.tilt) > 0.02) s.raf = requestAnimationFrame(render);
  };
  const kick = () => { if (!st.current.raf) st.current.raf = requestAnimationFrame(render); };

  useEffect(() => { kick(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useScrollFrame(sec, (p) => {
    st.current.target = -p * 300;
    kick();
  }, 'pin');

  // Arrastre con mouse o dedo (horizontal) para girar el anillo
  useEffect(() => {
    const el = sec.current.querySelector('.ring-stage');
    let x0 = null, base = 0, moved = false;
    const down = (e) => { x0 = e.clientX; base = st.current.drag; moved = false; };
    const move = (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4) moved = true;
      st.current.drag = base + dx * 0.18;
      kick();
    };
    const up = () => { x0 = null; };
    const click = (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      cancelAnimationFrame(st.current.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="galeria" ref={sec} className="relative h-[230svh] bg-ash-deep text-stone">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="ring-glow" aria-hidden="true" />
        <div className="absolute inset-x-0 top-[calc(84px+env(safe-area-inset-top,0px))] z-[2] wrap flex flex-wrap items-end justify-between gap-3">
          <h2 className="rv mask-up sec-title text-stone-soft"><span>{t.gal.title}</span></h2>
          <p className="rv max-w-[32ch] font-display text-[clamp(17px,1.6vw,22px)] italic text-gold-light">{t.gal.lead}</p>
        </div>

        <div className="ring-stage">
          <div ref={ring} className="ring">
            {GALLERY.map((id, i) => (
              <button
                type="button" key={id + i} onClick={() => setOpen(i)} aria-label={`${t.gal.title} ${i + 1}`}
                className="ring-card" style={{ transform: `rotateY(${i * STEP}deg) translate3d(0,0,var(--R))` }}
              >
                <Img id={id} w={700} sizes="(max-width: 768px) 46vw, 22vw" className="h-full w-full" alt="" />
              </button>
            ))}
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-[max(26px,env(safe-area-inset-bottom))] z-[2] text-center text-[13px] text-stone/55">{t.gal.hint}</p>
      </div>

      {open >= 0 && <Viewer start={open} onClose={close} />}
    </section>
  );
}
