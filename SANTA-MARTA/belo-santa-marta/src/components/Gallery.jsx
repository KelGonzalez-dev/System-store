import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY } from '../data';
import { IG, IG_ROOF, useI18n } from '../i18n';
import { lockScroll, useScrollFrame } from '../lib/scroll';

const N = GALLERY.length;

function Viewer({ start, onClose }) {
  const { t, pick } = useI18n();
  const [i, setI] = useState(start);
  const x0 = useRef(null);
  const go = useCallback((d) => setI((v) => (v + d + N) % N), []);
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
      onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      <figure key={i} className="gv-fig" onClick={(e) => e.stopPropagation()}>
        <img src={g.src} alt={pick(g.t)} />
        <figcaption>{pick(g.t)}<span>{i + 1} / {N}</span></figcaption>
      </figure>
      <button type="button" className="gv-btn gv-close" onClick={onClose} aria-label={t.gal.close}>✕</button>
      <button type="button" className="gv-btn gv-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={t.gal.prev}>‹</button>
      <button type="button" className="gv-btn gv-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={t.gal.next}>›</button>
    </div>
  );
}

// Paseo horizontal: al bajar, los cuadros avanzan de lado y giran en 3D según su posición
export default function Gallery() {
  const { t, pick } = useI18n();
  const sec = useRef(null);
  const track = useRef(null);
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  useScrollFrame(sec, (p, s) => {
    const tr = track.current;
    if (!tr) return;
    const max = tr.scrollWidth - s.vw + 40;
    const x = -p * Math.max(0, max);
    tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    const mid = s.vw / 2;
    for (const el of tr.children) {
      const c = el.offsetLeft + x + el.offsetWidth / 2;
      const d = Math.max(-1, Math.min(1, (c - mid) / (s.vw * 0.6)));
      el.style.transform = `perspective(1200px) rotateY(${(-d * 22).toFixed(1)}deg) translateZ(${(-Math.abs(d) * 120).toFixed(0)}px)`;
    }
  }, 'pin');
  return (
    <section id="galeria" ref={sec} className="gal-sec">
      <div className="gal-sticky">
        <div className="wrap gal-head">
          <div>
            <p className="eyebrow">{t.gal.eyebrow}</p>
            <h2 className="sec-title">{t.gal.title}</h2>
            <p className="mt-2 text-crema/60">{t.gal.lead}</p>
          </div>
          <div className="flex gap-2">
            <a className="btn btn-line !h-11 !px-5" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a>
            <a className="btn btn-line !h-11 !px-5" href={`https://www.instagram.com/${IG_ROOF}`} target="_blank" rel="noopener noreferrer">@{IG_ROOF}</a>
          </div>
        </div>
        <div ref={track} className="gal-track">
          {GALLERY.map((g, i) => (
            <button key={g.src} type="button" className="gal-frame" onClick={() => setOpen(i)} aria-label={pick(g.t)}>
              <img src={g.src} alt="" loading="lazy" decoding="async" />
              <span className="gal-cap"><b>0{i + 1}</b>{pick(g.t)}</span>
            </button>
          ))}
        </div>
      </div>
      {open >= 0 && <Viewer start={open} onClose={close} />}
    </section>
  );
}
