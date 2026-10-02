import { useEffect, useRef, useState } from 'react';
import { Badge } from './Mascot';
import Palm from './Palm';
import { LOCAL } from '../data';
import { useI18n } from '../i18n';
import { reducedMotion, scrollToTarget } from '../lib/scroll';
import { status } from '../lib/hours';

function OpenBadge({ t }) {
  const [s, setS] = useState(status);
  useEffect(() => { const id = setInterval(() => setS(status()), 60000); return () => clearInterval(id); }, []);
  return (
    <span className={`open-badge ${s.open ? 'is-open' : ''}`}><i aria-hidden="true" />{s.open ? t.hero.open : t.houses.closed}</span>
  );
}

// Escena derecha: hamburguesa real en marco ondulado, sello con la mascota y stickers, con profundidad al mover el mouse
function Stage({ t }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const layers = [...ref.current.querySelectorAll('[data-depth]')];
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate3d(${cx * d}px,${cy * d}px,0)`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="stage" aria-hidden="true">
      <div className="st-layer" data-depth="8"><div className="st-photo"><img src={LOCAL.burger} alt="" /></div></div>
      <div className="st-layer" data-depth="-12"><span className="sticker sk-red">{t.hero.stickers[0]}</span></div>
      <div className="st-layer" data-depth="16"><span className="sticker sk-yellow">{t.hero.stickers[1]}</span></div>
      <div className="st-layer" data-depth="22"><div className="st-badge"><Badge spin className="w-full" /></div></div>
      <div className="st-layer" data-depth="-18"><span className="sticker sk-script font-script">{t.hero.stickers[2]}</span></div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const go = (h) => (e) => { e.preventDefault(); scrollToTarget(h); };
  return (
    <section id="inicio" className="hero relative overflow-hidden">
      <div className="sunburst" aria-hidden="true" />
      <Palm className="hero-palm hp-l" />
      <Palm className="hero-palm hp-r" />
      <div key={lang} className="wrap relative grid min-h-[100svh] items-center gap-10 pb-28 pt-[calc(110px+env(safe-area-inset-top,0px))] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div>
          <div className="intro-up flex flex-wrap items-center gap-3" style={{ '--d': '0.1s' }}>
            <span className="eyebrow-sticker">{t.hero.eyebrow}</span>
            <OpenBadge t={t} />
          </div>
          <h1 className="hero-h1 font-display">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{t.hero.l1}</span></span>
            <span className="hl"><span className="hl-in retro" style={{ '--i': 1 }}>{t.hero.l2}</span></span>
          </h1>
          <p className="intro-up mt-6 max-w-[44ch] text-[clamp(16px,1.35vw,19px)] font-medium leading-relaxed text-vino/85" style={{ '--d': '0.95s' }}>{t.hero.sub}</p>
          <div className="intro-up mt-8 flex flex-wrap gap-3" style={{ '--d': '1.1s' }}>
            <a href="#casas" onClick={go('#casas')} className="btn btn-yellow">{t.hero.c1}</a>
            <a href="#reservas" onClick={go('#reservas')} className="btn btn-red">{t.hero.c2}</a>
            <a href="#menu" onClick={go('#menu')} className="btn btn-ghost">{t.hero.c3}</a>
          </div>
        </div>
        <div className="intro-pop"><Stage t={t} /></div>
      </div>
      <svg className="wave-bottom" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40c120-30 240-40 360-20s240 50 360 40 240-50 360-50 240 30 360 40v80H0z" /></svg>
    </section>
  );
}
