import { useEffect, useRef, useState } from 'react';
import Counter from './Counter';
import { Fleur, NeonLogo } from './Brand';
import { HERO_SLIDES, STATS } from '../data';
import { clamp, reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

function MemberCard() {
  return (
    <div className="mcard">
      <div className="mc-face mc-front">
        <span className="mc-holo" />
        <div className="mc-top"><NeonLogo club={false} /><span className="mc-chip" /></div>
        <p className="mc-member">MEMBER</p>
        <p className="mc-name">SOCIAL CLUB · BARRANQUILLA</p>
        <div className="mc-bottom"><span>N.º 0001 ⚜ VIP</span><span>EST. BAQ</span></div>
      </div>
      <div className="mc-face mc-back">
        <span className="mc-holo" />
        <span className="mc-strip" />
        <p className="mc-back-t">Tu silla te espera</p>
        <p className="mc-back-s">Corte · barba · skincare · uñas<br />y la primera bebida va por la casa</p>
      </div>
    </div>
  );
}

/**
 * Hero "Cine": las fotos reales del club pasan solas con movimiento de cámara lento (Ken Burns),
 * grano de película y destellos dorados; el logo de neón, el titular y la tarjeta VIP 3D al frente;
 * abajo, la barra de cifras que cuenta sola. Al bajar, todo se aleja en profundidad y la tarjeta se voltea.
 */
export default function Hero() {
  const sec = useRef(null);
  const [i, setI] = useState(0);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', clamp((p - 0.5) / 0.5).toFixed(3)); });
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const el = sec.current;
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
      <div className="hero-slides" aria-hidden="true">
        {HERO_SLIDES.map((src, k) => <div key={src} className={`hs ${k === i ? 'on' : ''} ${k === (i + HERO_SLIDES.length - 1) % HERO_SLIDES.length ? 'prev' : ''}`}><img src={src} alt="" loading={k ? 'lazy' : 'eager'} /></div>)}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-leak" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker intro" style={{ '--d': '0.2s' }}><Fleur /> Barranquilla · Social Club</p>
          <div className="hero-logo intro" style={{ '--d': '0.35s' }}><NeonLogo /></div>
          <h1 className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>La barbería</span></span>
            <span className="hl"><span className="hl-in" style={{ '--i': 1 }}><span className="gold-text">de los famosos</span></span></span>
          </h1>
          <p className="hero-p intro" style={{ '--d': '1s' }}>25 barberos profesionales, zona de manicure y pedicure, bar con cerveza, ron, tequila y whisky, snacks y pantallas para no perderte nada. Premium, pero como en casa.</p>
          <div className="hero-cta intro" style={{ '--d': '1.15s' }}>
            <a href="#reservar" onClick={(e) => { e.preventDefault(); scrollToTarget('#reservar'); }} className="btn btn-gold btn-xl">Reservar mi silla</a>
            <a href="#club" onClick={(e) => { e.preventDefault(); scrollToTarget('#club'); }} className="btn btn-glass btn-xl">Recorrer el club</a>
          </div>
        </div>
        <div className="hero-card intro-pop" aria-hidden="true"><MemberCard /></div>
      </div>
      <div className="wrap hero-stats-wrap">
        <dl className="hero-stats intro" style={{ '--d': '1.35s' }}>
          {STATS.map((s) => <div key={s.l}><dt><Counter n={s.n} s={s.s} /></dt><dd>{s.l}</dd></div>)}
        </dl>
        <div className="hero-dots" aria-hidden="true">{HERO_SLIDES.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
      </div>
    </section>
  );
}
