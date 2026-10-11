import { useEffect, useRef } from 'react';
import { QuileLogo } from './Brand';
import { WaIcon } from './Nav';
import { L } from '../data';
import { useI18n, wa } from '../i18n';
import { createEmbers, autoPause } from '../lib/embers';
import { clamp, reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

function Embers({ count = 70 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const e = createEmbers(ref.current, { count: window.innerWidth < 720 ? Math.round(count * 0.55) : count, intensity: 0.75 });
    return autoPause(ref.current, e);
  }, [count]);
  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
export { Embers };

// Escena: la espada de carnes real en un arco con resplandor de brasa + fotos flotantes, con profundidad al mover el mouse
function Stage({ chip }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const layers = [...ref.current.querySelectorAll('[data-d]')];
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach((l) => { const d = +l.dataset.d; l.style.transform = `translate3d(${cx * d}px,${cy * d}px,0)`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="stage" aria-hidden="true">
      <div className="st-glow" />
      <div className="st-l" data-d="6"><div className="st-arch"><img src={L.espada} alt="" fetchpriority="high" /></div></div>
      <div className="st-l" data-d="-14"><div className="st-bubble b1"><img src={L.salchiquiloca} alt="" /></div></div>
      <div className="st-l" data-d="18"><div className="st-bubble b2"><img src={L.mazorcada} alt="" /></div></div>
      <div className="st-l" data-d="-8"><div className="st-chip">{chip}</div></div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const sec = useRef(null);
  const copy = useRef(null);
  const stage3d = useRef(null);
  // Al bajar, la escena se inclina hacia atrás en 3D y el texto se aleja (efecto de profundidad)
  useScrollFrame(sec, (p, st) => {
    if (reducedMotion() || !copy.current) return;
    const k = clamp(st.y / Math.max(1, st.vh));
    copy.current.style.transform = `translate3d(0, ${k * -70}px, 0)`;
    copy.current.style.opacity = String(1 - k * 0.9);
    stage3d.current.style.transform = `perspective(1000px) rotateX(${k * 22}deg) translate3d(0, ${k * 60}px, ${k * -160}px)`;
  });
  return (
    <section ref={sec} id="inicio" className="hero relative overflow-hidden">
      <div className="hero-bg" aria-hidden="true" />
      <Embers />
      <div key={lang} className="wrap relative grid min-h-[100svh] items-center gap-10 pb-24 pt-[calc(108px+env(safe-area-inset-top,0px))] lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        <div ref={copy} className="relative z-[2] will-change-transform">
          <p className="eyebrow intro" style={{ '--d': '0.15s' }}><span className="dot" />{t.hero.eyebrow}</p>
          <h1 className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{t.hero.l1}</span></span>
            <span className="hl"><span className="hl-in script" style={{ '--i': 1 }}>{t.hero.l2}</span></span>
          </h1>
          <p className="intro mt-6 max-w-[46ch] text-[clamp(15.5px,1.3vw,18px)] leading-relaxed text-crema/75" style={{ '--d': '0.95s' }}>{t.hero.sub}</p>
          <div className="intro mt-8 flex flex-wrap gap-3" style={{ '--d': '1.1s' }}>
            <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-fire"><WaIcon />{t.hero.c1}</a>
            <a href="#carta" onClick={(e) => { e.preventDefault(); scrollToTarget('#carta'); }} className="btn btn-ghost">{t.hero.c2}</a>
          </div>
          <div className="intro hero-stats" style={{ '--d': '1.25s' }}>
            <div><b>10 mil</b><span>{t.hero.fans}</span></div>
            <div><b>658</b><span>{t.hero.posts}</span></div>
            <div><b className="font-script normal-case">¡{t.hero.since}!</b><span>Riohacha</span></div>
          </div>
        </div>
        <div className="intro-pop relative"><div ref={stage3d} className="stage-3d"><Stage chip={t.hero.chip} /></div></div>
      </div>
      <div className="hero-logo-wm" aria-hidden="true"><QuileLogo plank={false} glow={false} /></div>
    </section>
  );
}
