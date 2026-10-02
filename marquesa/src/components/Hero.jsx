import { useEffect, useRef, useState } from 'react';
import { LOCAL } from '../data';
import { useI18n } from '../i18n';
import { reducedMotion, scrollToTarget } from '../lib/scroll';
import { status } from '../lib/hours';

// Palabra que cambia como un letrero de neón que parpadea
function Rotator({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return <span key={i} className="rot-word font-script neon-script">{words[i]}</span>;
}

// Etiqueta "Abierto ahora" / horario de hoy, con hora de Colombia
function OpenBadge({ t }) {
  const [s, setS] = useState(status);
  useEffect(() => { const id = setInterval(() => setS(status()), 60000); return () => clearInterval(id); }, []);
  const hours = t.visit.days[s.row][1];
  return (
    <span className={`open-badge ${s.open ? 'is-open' : ''}`}>
      <i aria-hidden="true" />{s.open ? t.hero.openNow : t.hero.closedNow} · {hours}
    </span>
  );
}

// Emblema: logo real con aro de neón, fotos que orbitan, globos y etiquetas
function Emblem({ t }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const layers = [...ref.current.querySelectorAll('[data-depth]')];
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate3d(${cx * d}px,${cy * d}px,0)`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  const chips = [LOCAL.burgerAlta, LOCAL.tacos, LOCAL.dedos, LOCAL.neonAmor];
  return (
    <div ref={ref} className="emblem" aria-hidden="true">
      <div className="em-layer" data-depth="-14">
        <svg viewBox="0 0 400 400" className="em-arc"><path d="M40 360V200a160 160 0 0 1 320 0v160" pathLength="1" /></svg>
      </div>
      <div className="em-layer" data-depth="10">
        <i className="em-balloon b1" /><i className="em-balloon b2" /><i className="em-balloon b3" />
      </div>
      <div className="em-layer em-core" data-depth="6">
        <div className="em-dash" />
        <div className="em-ring" />
        <img src={LOCAL.logo} alt="" className="em-logo" draggable="false" />
      </div>
      <div className="em-layer" data-depth="18">
        <div className="em-orbit">
          {chips.map((src, i) => (
            <span key={src} className="em-chip" style={{ '--a': `${i * 90 + 20}deg` }}><img src={src} alt="" draggable="false" /></span>
          ))}
        </div>
      </div>
      <div className="em-layer" data-depth="24">
        <span className="em-tag tag-a">{t.hero.tags[0]}</span>
        <span className="em-tag tag-b font-script">{t.hero.tags[1]}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const go = (h) => (e) => { e.preventDefault(); scrollToTarget(h); };
  return (
    <section id="inicio" className="hero relative flex min-h-[100svh] items-center overflow-hidden bg-noche">
      <div className="hero-bg" aria-hidden="true"><img src={LOCAL.fondo} alt="" fetchpriority="high" /></div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div key={lang} className="wrap relative grid items-center gap-10 pb-20 pt-[calc(108px+env(safe-area-inset-top,0px))] lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <div>
          <div className="intro-up flex flex-wrap items-center gap-3" style={{ '--d': '0.15s' }}>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <OpenBadge t={t} />
          </div>
          <h1 className="hero-h1 font-display">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{t.hero.l1}</span></span>
            <span className="hl"><span className="hl-in neon-text flicker-on" style={{ '--i': 1 }}>{t.hero.l2}</span></span>
          </h1>
          <p className="hero-crave intro-up" style={{ '--d': '0.9s' }}>
            <span className="text-hueso/70">{t.hero.pre}</span> <Rotator words={t.hero.words} />
          </p>
          <p className="intro-up mt-5 max-w-[46ch] text-[clamp(15px,1.25vw,17px)] leading-relaxed text-hueso/75" style={{ '--d': '1.05s' }}>{t.hero.sub}</p>
          <div className="intro-up mt-8 flex flex-wrap gap-3" style={{ '--d': '1.2s' }}>
            <a href="#visitanos" onClick={go('#visitanos')} className="btn btn-neon">{t.hero.c1}</a>
            <a href="#carta" onClick={go('#carta')} className="btn btn-outline">{t.hero.c2}</a>
          </div>
        </div>
        <div className="intro-pop"><Emblem t={t} /></div>
      </div>
      <div className="checker-strip" aria-hidden="true" />
    </section>
  );
}
