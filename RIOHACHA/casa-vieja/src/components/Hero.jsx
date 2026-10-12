import { useEffect, useRef, useState } from 'react';
import { WaIcon } from './Nav';
import { L } from '../data';
import { useI18n, wa } from '../i18n';
import { fmtMin, isNightNow, status } from '../lib/hours';
import { clamp, reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

function OpenBadge() {
  const { t, lang } = useI18n();
  const [s, setS] = useState(status);
  useEffect(() => { const id = setInterval(() => setS(status()), 60000); return () => clearInterval(id); }, []);
  return (
    <span className={`open-badge ${s.open ? 'is-open' : ''}`}>
      <i aria-hidden="true" />
      {s.open ? `${t.hero.openNow} · ${t.hero.until} ${fmtMin(s.close, lang)}` : t.hero.closedNow}
    </span>
  );
}

// Arco colonial con fotos que cambian entre día y noche; cuelga una bombilla y sale vapor del café
function Arch({ night }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const el = ref.current;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      el.style.setProperty('--mx', cx.toFixed(3)); el.style.setProperty('--my', cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="arch-scene" aria-hidden="true">
      <div className="arch-glow" />
      <div className="arch">
        <img className={`arch-img ${!night ? 'on' : ''}`} src={L.fachada} alt="" fetchpriority="high" />
        <img className={`arch-img ${night ? 'on' : ''}`} src={L.michelada} alt="" />
        <span className="arch-frame" />
      </div>
      <div className="arch-polaroid p-a"><img src={night ? L.barista : L.espresso} alt="" /></div>
      <div className="arch-polaroid p-b"><img src={night ? L.capuchino : L.torta} alt="" /><span className="steam s1" /><span className="steam s2" /></div>
      <div className="bulbs"><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  );
}

export default function Hero({ night, setNight }) {
  const { t, lang } = useI18n();
  const sec = useRef(null);
  const inner = useRef(null);
  // al bajar, el arco se inclina hacia atrás en 3D y el texto sube
  useScrollFrame(sec, (p) => {
    if (!inner.current) return;
    const k = clamp((p - 0.5) / 0.5);
    inner.current.style.setProperty('--k', k.toFixed(3));
  });
  const H = night
    ? { e: t.hero.nightEyebrow, l1: t.hero.nightL1, l2: t.hero.nightL2, s: t.hero.nightSub }
    : { e: t.hero.dayEyebrow, l1: t.hero.dayL1, l2: t.hero.dayL2, s: t.hero.daySub };
  return (
    <section id="inicio" ref={sec} className={`hero ${night ? 'is-night' : 'is-day'}`}>
      <div className="hero-sky" aria-hidden="true"><div className="sky-day" /><div className="sky-night" /><div className="tiles" /></div>
      <div ref={inner} className="wrap hero-grid">
        <div className="hero-text">
          <div className="intro flex flex-wrap items-center gap-3" style={{ '--d': '0.15s' }}>
            <div className="dn-switch" role="group" aria-label={`${t.hero.day} / ${t.hero.night}`}>
              <button type="button" className={!night ? 'on' : ''} onClick={() => setNight(false)} aria-pressed={!night}>☀ {t.hero.day}</button>
              <button type="button" className={night ? 'on' : ''} onClick={() => setNight(true)} aria-pressed={night}>☾ {t.hero.night}</button>
              <i aria-hidden="true" />
            </div>
            <OpenBadge />
          </div>
          <p key={`e-${night}-${lang}`} className="hero-eyebrow swap">{H.e}</p>
          <h1 key={`h-${night}-${lang}`} className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{H.l1}</span></span>
            <span className="hl"><span className="hl-in em" style={{ '--i': 1 }}>{H.l2}</span></span>
          </h1>
          <p key={`s-${night}-${lang}`} className="hero-sub swap">{H.s}</p>
          <div className="intro mt-8 flex flex-wrap gap-3" style={{ '--d': '1.05s' }}>
            <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold"><WaIcon />{t.hero.c1}</a>
            <a href="#carta" onClick={(e) => { e.preventDefault(); scrollToTarget('#carta'); }} className="btn btn-line">{t.hero.c2}</a>
          </div>
          <p className="intro hero-note font-hand" style={{ '--d': '1.25s' }}>“{t.hero.note}”</p>
        </div>
        <div className="intro-pop"><Arch night={night} /></div>
      </div>
    </section>
  );
}
