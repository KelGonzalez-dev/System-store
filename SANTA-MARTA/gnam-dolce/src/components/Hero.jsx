import { useEffect, useRef } from 'react';
import { DolceVita, GnamLogo, Swoosh } from './Brand';
import { GALLERY } from '../data';
import { useI18n, wa } from '../i18n';
import { clamp, reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

// Columnas de fotos que suben y bajan sin parar (como una vitrina), inclinadas en 3D
function Vitrina() {
  const cols = [GALLERY.slice(0, 3), GALLERY.slice(3, 6), GALLERY.slice(6, 9)];
  return (
    <div className="vitrina" aria-hidden="true">
      <div className="vit-plane">
        {cols.map((c, i) => (
          <div key={i} className={`vit-col v${i}`}>
            <div className="vit-track">
              {[...c, ...c].map((src, k) => <div key={k} className="vit-card"><img src={src} alt="" loading={k < 3 ? 'eager' : 'lazy'} decoding="async" /></div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hero "Vitrina": portada como su carta (damasco crema y la gran G),
 * el logo Gnam escrito a mano, y a la derecha una vitrina de columnas de fotos en movimiento,
 * inclinada en 3D, que se endereza al hacer scroll.
 */
export default function Hero() {
  const { t } = useI18n();
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', clamp((p - 0.5) / 0.5).toFixed(3)); });
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const el = sec.current;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      el.style.setProperty('--mx', cx.toFixed(3)); el.style.setProperty('--my', cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero-damask" aria-hidden="true" />
      <Swoosh className="hero-swoosh" />
      <Vitrina />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="kicker intro" style={{ '--d': '0.2s' }}>{t.hero.kicker}</p>
          <div className="hero-logo"><GnamLogo /></div>
          <p className="hero-line intro" style={{ '--d': '1.2s' }}>{t.hero.line}</p>
          <div className="intro mt-8 flex flex-wrap gap-3" style={{ '--d': '1.35s' }}>
            <a href={wa(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="btn btn-choco">{t.hero.c1}</a>
            <a href="#carta" onClick={(e) => { e.preventDefault(); scrollToTarget('#carta'); }} className="btn btn-line">{t.hero.c2}</a>
          </div>
        </div>
      </div>
      <DolceVita className="hero-dv" label={t.hero.badge} />
      <p className="hero-scroll" aria-hidden="true"><i />{t.hero.scroll}</p>
    </section>
  );
}
