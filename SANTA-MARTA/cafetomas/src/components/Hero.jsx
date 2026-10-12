import { useEffect, useRef } from 'react';
import { Logo, Mark } from './Brand';
import { L } from '../data';
import { useI18n } from '../i18n';
import { clamp, reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

// Bloques de color como sus publicaciones (naranja, amarillo, morado), con tarjetas en 3D que siguen al mouse
export default function Hero() {
  const { t } = useI18n();
  const sec = useRef(null);
  const stage = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', clamp((p - 0.5) / 0.5).toFixed(3)); });
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const el = stage.current;
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
    <section id="inicio" ref={sec} className="hero">
      <div className="hero-blob b1" aria-hidden="true" /><div className="hero-blob b2" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="eyebrow intro" style={{ '--d': '0.15s' }}>{t.hero.eyebrow}</p>
          <h1 className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{t.hero.l1}</span></span>
            <span className="hl"><span className="hl-in hl-y" style={{ '--i': 1 }}>{t.hero.l2}</span></span>
          </h1>
          <p className="hero-lead intro" style={{ '--d': '0.95s' }}>{t.hero.lead}</p>
          <div className="intro mt-8 flex flex-wrap gap-3" style={{ '--d': '1.1s' }}>
            <a href="#carta" onClick={(e) => { e.preventDefault(); scrollToTarget('#carta'); }} className="btn btn-yellow">{t.hero.c1}</a>
            <a href="#escuela" onClick={(e) => { e.preventDefault(); scrollToTarget('#escuela'); }} className="btn btn-line">{t.hero.c2}</a>
          </div>
        </div>
        <div ref={stage} className="hero-stage intro-pop" aria-hidden="true">
          <div className="hs-card c-orange"><img src={L.pumpkin} alt="" fetchpriority="high" /></div>
          <div className="hs-card c-yellow"><img src={L.latte} alt="" /></div>
          <div className="hs-card c-small"><img src={L.cerezas} alt="" /></div>
          <div className="hs-badge"><Logo /></div>
          <span className="hs-chip">🥇 {t.hero.badge}</span>
          <span className="bean b-a"><Mark /></span>
        </div>
      </div>
    </section>
  );
}
