import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY } from '../data';
import { IG, useI18n } from '../i18n';
import { clamp, lockScroll, reducedMotion, useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;

// Visor a pantalla completa: la foto entra con zoom suave (efecto Ken Burns), se pasa con flechas, teclado o deslizando
function Viewer({ start, onClose }) {
  const { t, pick } = useI18n();
  const [i, setI] = useState(start);
  const x0 = useRef(null);
  const go = useCallback((d) => setI((v) => (v + d + N) % N), []);
  useEffect(() => {
    const key = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', key);
    lockScroll(true);
    return () => { document.removeEventListener('keydown', key); lockScroll(false); };
  }, [go, onClose]);
  const g = GALLERY[i];
  return (
    <div className="gviewer" role="dialog" aria-modal="true" aria-label={t.gal.title} onClick={onClose}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 50) { e.stopPropagation(); go(dx < 0 ? 1 : -1); } }}>
      <div className="gv-bg" style={{ backgroundImage: `url(${g.src})` }} key={`bg${i}`} aria-hidden="true" />
      <figure className="gv-fig" onClick={(e) => e.stopPropagation()}>
        <div className="gv-img" key={i}><img src={g.src} alt={pick(g.c)} draggable="false" /></div>
        <figcaption><span className="font-script">{pick(g.c)}</span><b>{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</b></figcaption>
      </figure>
      <button type="button" className="gv-btn gv-close" onClick={onClose} aria-label={t.gal.close}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button type="button" className="gv-btn gv-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.gal.prev}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className="gv-btn gv-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.gal.next}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.8"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

/**
 * Galería en arco 3D: la sección se queda fija y, al bajar, las fotos desfilan por un arco
 * (la del centro al frente, las demás giran hacia el fondo). También se arrastra con el dedo o el mouse.
 * Todo con transform/opacity en un solo requestAnimationFrame.
 */
export default function Gallery() {
  const { t, pick } = useI18n();
  const sec = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [open, setOpen] = useState(-1);
  const drag = useRef({ x: null, moved: false });

  useScrollFrame(sec, (p, st) => {
    const cards = track.current.children;
    const pos = p * (N - 1);
    const mobile = st.vw < 768;
    const gap = mobile ? st.vw * 0.56 : Math.min(340, st.vw * 0.24);
    for (let i = 0; i < cards.length; i++) {
      const d = i - pos;
      const ad = Math.abs(d);
      const c = clamp(d, -3.2, 3.2);
      const z = -Math.min(ad, 4) * (mobile ? 140 : 190);
      const ry = reducedMotion() ? 0 : -c * (mobile ? 30 : 38);
      const x = c * gap * (1 - Math.min(ad, 4) * 0.06);
      cards[i].style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${ry}deg)`;
      cards[i].style.opacity = String(ad > 3.6 ? 0 : 1 - Math.max(0, ad - 2.4) * 0.7);
      cards[i].style.zIndex = String(100 - Math.round(ad * 10));
    }
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    const a = Math.round(pos);
    if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
  }, 'pin');

  // Ir a una foto: mueve el scroll hasta su posición dentro de la sección fija
  const goTo = (i) => {
    const el = sec.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (clamp(i, 0, N - 1) / (N - 1)) * range, behavior: 'smooth' });
  };

  // Arrastrar con el mouse/dedo recorre la galería (convierte el arrastre en scroll)
  const onDown = (e) => { drag.current = { x: e.clientX, moved: false }; };
  const onMove = (e) => {
    if (drag.current.x === null || e.pointerType === 'touch') return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) {
      drag.current.moved = true;
      const el = sec.current;
      const range = el.offsetHeight - window.innerHeight;
      window.scrollBy(0, (-dx / (window.innerWidth * 0.24)) * (range / (N - 1)));
      drag.current.x = e.clientX;
    }
  };
  const onUp = () => { drag.current.x = null; };

  const g = GALLERY[clamp(active, 0, N - 1)];
  return (
    <section ref={sec} id="galeria" className="gal-sec relative" style={{ height: `${N * 38}svh` }}>
      <div className="gal-sticky">
        <div className="gal-bg" aria-hidden="true">
          {GALLERY.map((x, i) => <div key={x.src} className={i === active ? 'on' : ''} style={{ backgroundImage: `url(${x.src})` }} />)}
        </div>
        <div className="wrap gal-head">
          <div>
            <p className="eyebrow">{t.gal.eyebrow}</p>
            <h2 className="sec-title mt-2 text-crema">{t.gal.title}</h2>
          </div>
          <a href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !h-11 !px-5">@{IG}</a>
        </div>
        <div className="gal-stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
          <div ref={track} className="gal-track">
            {GALLERY.map((x, i) => (
              <button key={x.src} type="button" className={`gal-card ${i === active ? 'is-on' : ''}`}
                onClick={() => { if (drag.current.moved) { drag.current.moved = false; return; } if (i === active) setOpen(i); else goTo(i); }}
                aria-label={pick(x.c)}>
                <img src={x.src} alt={pick(x.c)} loading="lazy" decoding="async" draggable="false" />
                <span className="gal-shine" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <div className="wrap gal-foot">
          <p className="gal-cap"><span className="font-script" key={active}>{pick(g.c)}</span></p>
          <div className="gal-nav">
            <button type="button" onClick={() => goTo(active - 1)} aria-label={t.gal.prev} disabled={active === 0}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <span className="gal-count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(active + 1)} aria-label={t.gal.next} disabled={active === N - 1}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="gal-progress"><i ref={bar} /></div>
          <p className="gal-hint">{t.gal.lead}</p>
        </div>
      </div>
      {open >= 0 && <Viewer start={open} onClose={() => setOpen(-1)} />}
    </section>
  );
}
