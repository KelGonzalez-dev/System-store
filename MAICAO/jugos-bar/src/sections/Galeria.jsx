import { useCallback, useEffect, useRef, useState } from 'react';
import { GALLERY, INSTAGRAM } from '../data/content';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon } from '../components/Icons';

function Lightbox({ i, onClose, onGo }) {
  const g = GALLERY[i];
  const sx = useRef(0);

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onGo(1);
      if (e.key === 'ArrowLeft') onGo(-1);
    };
    window.addEventListener('keydown', key);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.documentElement.style.overflow = '';
    };
  }, [onClose, onGo]);

  return (
    <div className="lb fixed inset-0 z-[85] flex items-center justify-center bg-ink/95 p-4" role="dialog" aria-modal="true" aria-label={g.alt} onClick={onClose}
      onTouchStart={(e) => { sx.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - sx.current; if (Math.abs(d) > 50) onGo(d < 0 ? 1 : -1); }}>
      <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-brand hover:text-ink"><Icon name="close" /></button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onGo(-1); }} aria-label="Anterior" className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-brand hover:text-ink"><Icon name="arrowLeft" /></button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onGo(1); }} aria-label="Siguiente" className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-brand hover:text-ink"><Icon name="arrow" /></button>
      <figure key={i} className="lb-img max-h-[86svh] max-w-[min(92vw,1100px)]" onClick={(e) => e.stopPropagation()}>
        <Photo k={g.k} w={1600} alt={g.alt} eager className="max-h-[80svh] w-auto max-w-full rounded-3xl" />
        <figcaption className="mt-3 text-center text-sm text-white/70">{g.alt} · {i + 1} / {GALLERY.length}</figcaption>
      </figure>
    </div>
  );
}

const SIZES = ['w-56 sm:w-72', 'w-64 sm:w-96', 'w-52 sm:w-64', 'w-60 sm:w-80'];
const TILT = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'];

function Row({ order, rev, speed, onOpen }) {
  const list = order.map((idx) => ({ ...GALLERY[idx], idx }));
  return (
    <div className="gal-row-wrap overflow-hidden py-4">
      <div className={`gal-row flex w-max ${rev ? 'gal-rev' : ''}`} style={{ '--s': `${speed}s` }}>
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6" aria-hidden={rep === 1}>
            {list.map((g, n) => (
              <button key={`${rep}-${g.idx}`} type="button" tabIndex={rep === 1 ? -1 : 0} onClick={() => onOpen(g.idx)} aria-label={`Ver foto: ${g.alt}`}
                className={`tile group relative h-56 shrink-0 overflow-hidden rounded-[1.75rem] bg-card shadow-[0_18px_40px_-20px_rgba(0,0,0,.5)] transition-[transform,box-shadow] duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.04] sm:h-80 ${SIZES[(n + (rev ? 1 : 0)) % 4]} ${TILT[(n + (rev ? 2 : 0)) % 4]}`}>
                <Photo k={g.k} w={800} alt={g.alt} pos={g.pos} className="tile-img absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 flex translate-y-3 items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-ink opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">{g.alt}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Galeria() {
  const [sel, setSel] = useState(null);
  const go = useCallback((d) => setSel((s) => (s === null ? s : (s + d + GALLERY.length) % GALLERY.length)), []);
  const close = useCallback(() => setSel(null), []);
  const n = GALLERY.length;
  const a = Array.from({ length: n }, (_, i) => i);
  const b = [...a].reverse().map((v, i) => (v + 2) % n);

  return (
    <section id="galeria" className="cv-auto relative overflow-hidden bg-s1 py-20 text-fg sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Galería</p>
            <h2 className="h-display mt-5 text-5xl sm:text-7xl lg:text-8xl">Se antoja<br />con los ojos</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-xs text-fg/65">Toca cualquier foto para verla grande. Y cuando se te antoje, pídelo.</p>
          </Reveal>
        </div>
      </div>

      <div className="mt-12 space-y-2">
        <Row order={a} speed={55} onOpen={setSel} />
        <Row order={b} rev speed={70} onOpen={setSel} />
      </div>

      <Reveal className="container-x mt-12 flex flex-wrap items-center justify-center gap-4">
        <a href="#/menu" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('jb:go', { detail: '#/menu' })); }} className="btn btn-green px-8 py-4">Pedir lo que se te antojó<Icon name="arrow" className="h-4 w-4" /></a>
        <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="btn-alt"><Icon name="instagram" className="h-5 w-5" />{INSTAGRAM.handle}</a>
      </Reveal>

      {sel !== null && <Lightbox i={sel} onClose={close} onGo={go} />}
    </section>
  );
}
