import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY } from '../data';
import { IG, useI18n } from '../i18n';
import { lockScroll, useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;

// Visor a pantalla completa: la foto entra girando en 3D; flechas, teclado y deslizar
function Viewer({ start, onClose }) {
  const { t, pick } = useI18n();
  const [i, setI] = useState(start);
  const [dir, setDir] = useState(1);
  const x0 = useRef(null);
  const go = useCallback((d) => { setDir(d); setI((v) => (v + d + N) % N); }, []);
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', k);
    lockScroll(true);
    return () => { document.removeEventListener('keydown', k); lockScroll(false); };
  }, [go, onClose]);
  const g = GALLERY[i];
  return (
    <div className="gviewer" role="dialog" aria-modal="true" aria-label={t.gal.title} onClick={onClose}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 50) { e.stopPropagation(); go(dx < 0 ? 1 : -1); } }}>
      <figure key={i} className={`gv-fig ${dir > 0 ? 'from-r' : 'from-l'}`} onClick={(e) => e.stopPropagation()}>
        <img src={g.src} alt={pick(g.t)} />
        <figcaption className="font-hand">{pick(g.t)}<span>{i + 1} / {N}</span></figcaption>
      </figure>
      <button type="button" className="gv-btn gv-close" onClick={onClose} aria-label={t.gal.close}>✕</button>
      <button type="button" className="gv-btn gv-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.gal.prev}>‹</button>
      <button type="button" className="gv-btn gv-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.gal.next}>›</button>
    </div>
  );
}

// Galería en columnas que se mueven a distinta velocidad (profundidad) y cuadros que se inclinan en 3D
export default function Gallery() {
  const { t, pick } = useI18n();
  const ref = useRef(null);
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  useScrollFrame(ref, (p, s) => {
    const el = ref.current;
    if (!el) return;
    const amp = s.vw < 768 ? 60 : 140;
    el.style.setProperty('--g1', `${((0.5 - p) * amp).toFixed(1)}px`);
    el.style.setProperty('--g2', `${((p - 0.5) * amp * 1.2).toFixed(1)}px`);
    el.style.setProperty('--g3', `${((0.5 - p) * amp * 0.7).toFixed(1)}px`);
    el.style.setProperty('--gr', `${((p - 0.5) * 16).toFixed(2)}deg`);
  });
  const cols = [[], [], []];
  GALLERY.forEach((g, i) => cols[i % 3].push({ ...g, i }));
  return (
    <section id="galeria" ref={ref} className="gal-sec relative overflow-hidden">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{t.gal.eyebrow}</p>
            <h2 className="rv mask-up sec-title mt-3"><span>{t.gal.title}</span></h2>
            <p className="rv mt-3 text-[16px] text-cafe/70">{t.gal.lead}</p>
          </div>
          <a href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="btn btn-line">@{IG}</a>
        </div>
        <div className="gcols">
          {cols.map((col, c) => (
            <div key={c} className={`gcol gc${c + 1}`}>
              {col.map((g) => (
                <button key={g.src} type="button" className="gframe" onClick={() => setOpen(g.i)} aria-label={pick(g.t)}>
                  <img src={g.src} alt="" loading="lazy" decoding="async" />
                  <span className="gcap font-hand">{pick(g.t)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {open >= 0 && <Viewer start={open} onClose={close} />}
    </section>
  );
}
