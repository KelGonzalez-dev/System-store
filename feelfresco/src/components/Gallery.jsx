import { useCallback, useEffect, useRef, useState } from 'react';
import Img from './Img';
import { GALLERY, U } from '../data';
import { useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';

const N = GALLERY.length;
const ROT = [-6, 4, -3, 7, -5, 3, -7, 5];

// Visor tipo "pila de fotos": la de encima sale volando a un lado con giro (o se arrastra con el dedo)
function Viewer({ start, onClose }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(start);
  const [fly, setFly] = useState(null); // { i, dir }
  const drag = useRef({ x0: null, dx: 0 });
  const top = useRef(null);
  const swiped = useRef(false);

  const go = useCallback((dir) => {
    setFly({ i: pos, dir });
    setPos((p) => (p + (dir > 0 ? 1 : -1) + N) % N);
  }, [pos]);

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
  useEffect(() => { if (fly) { const id = setTimeout(() => setFly(null), 650); return () => clearTimeout(id); } return undefined; }, [fly]);

  const down = (e) => { drag.current = { x0: e.clientX, dx: 0 }; };
  const move = (e) => {
    if (drag.current.x0 === null || !top.current) return;
    const dx = e.clientX - drag.current.x0;
    drag.current.dx = dx;
    top.current.style.transition = 'none';
    top.current.style.transform = `translate3d(${dx}px,0,0) rotate(${dx * 0.05}deg)`;
  };
  const up = () => {
    const { x0, dx } = drag.current;
    drag.current = { x0: null, dx: 0 };
    if (x0 === null || !top.current) return;
    top.current.style.transition = '';
    top.current.style.transform = '';
    if (Math.abs(dx) > 70) { swiped.current = true; go(dx < 0 ? 1 : -1); }
  };

  const stack = [0, 1, 2].map((k) => (pos + k) % N);
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={t.gal.title}
      onClick={() => { if (swiped.current) { swiped.current = false; return; } onClose(); }}
      onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className="viewer-stack" onClick={(e) => e.stopPropagation()}>
        {stack.slice().reverse().map((i) => {
          const k = stack.indexOf(i);
          if (fly && fly.dir < 0 && i === fly.i) return null; // la que sale volando no se duplica debajo
          return (
            <div key={i} ref={k === 0 ? top : undefined} className={`v-card k${k}`} style={{ '--rot': `${ROT[i % ROT.length] * 0.6}deg` }}
              onPointerDown={k === 0 ? down : undefined}>
              <img src={U(GALLERY[i], 1400)} alt="" draggable="false" />
            </div>
          );
        })}
        {fly && (
          <div className={`v-card k0 is-fly ${fly.dir > 0 ? 'to-l' : 'to-r'}`} style={{ '--rot': `${ROT[fly.i % ROT.length] * 0.6}deg` }}>
            <img src={U(GALLERY[fly.i], 1400)} alt="" draggable="false" />
          </div>
        )}
      </div>
      <p className="viewer-count font-display">{pos + 1} / {N}</p>
      <p className="viewer-hint">{t.gal.hint}</p>
      <button type="button" className="lb-btn right-5 top-[calc(16px+env(safe-area-inset-top,0px))]" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label={t.gal.close}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button type="button" className="lb-btn left-3 top-1/2 -translate-y-1/2 md:left-8" aria-label="←" onClick={(e) => { e.stopPropagation(); go(-1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.6" strokeLinecap="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" className="lb-btn right-3 top-1/2 -translate-y-1/2 md:right-8" aria-label="→" onClick={(e) => { e.stopPropagation(); go(1); }}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.6" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

// Pared de polaroids: caen girando al entrar en pantalla y se enderezan al pasar el mouse
export default function Gallery() {
  const { t } = useI18n();
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  return (
    <section id="galeria" className="gal-sec relative overflow-hidden py-[clamp(80px,10vw,130px)]">
      <div className="wrap">
        <div className="text-center">
          <h2 className="rv mask-up sec-title text-rojo"><span>{t.gal.title}</span></h2>
          <p className="rv mt-3 font-script text-[clamp(30px,3.2vw,44px)] text-vino">{t.gal.lead}</p>
        </div>
        <div className="polaroids mt-12">
          {GALLERY.map((id, i) => (
            <button type="button" key={id + i} className="polaroid rv" style={{ '--rot': `${ROT[i % ROT.length]}deg`, '--k': i % 4 }} onClick={() => setOpen(i)} aria-label={`${t.gal.title} ${i + 1}`}>
              <i className="tape-piece" aria-hidden="true" />
              <span className="pol-photo"><Img id={id} w={600} sizes="(max-width: 768px) 45vw, 22vw" className="h-full w-full" alt="" /></span>
            </button>
          ))}
        </div>
      </div>
      {open >= 0 && <Viewer start={open} onClose={close} />}
    </section>
  );
}
