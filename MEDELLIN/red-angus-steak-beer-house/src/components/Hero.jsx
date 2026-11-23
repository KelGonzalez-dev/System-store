import { useEffect, useRef } from 'react';
import Foto from './Foto';
import { Letrero } from './Logo';
import { CONFIG, F, SEDES } from '../data';
import { reducedMotion, scrollToTarget, useScrollFrame } from '../lib/scroll';

/**
 * Hero: foto del corte con movimiento lento (Ken Burns) y humo, y el letrero de Red Angus colgando de
 * cadenas: se balancea solo y reacciona al movimiento del mouse como un letrero real (física de péndulo).
 */
export default function Hero() {
  const sec = useRef(null);
  const sign = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', Math.min(1, Math.max(0, (p - 0.5) * 2)).toFixed(3)); });

  useEffect(() => {
    const el = sign.current;
    if (!el || reducedMotion()) return undefined;
    let ang = -8, vel = 0, raf = 0, lastX = null, empuje = 0, visible = true;
    const paso = () => {
      // péndulo amortiguado + empujón del mouse
      vel += -ang * 0.012 + empuje;
      vel *= 0.985;
      ang += vel;
      empuje *= 0.6;
      el.style.transform = `rotate(${ang.toFixed(3)}deg)`;
      if (visible) raf = requestAnimationFrame(paso);
    };
    const mover = (e) => {
      if (lastX !== null) empuje += Math.max(-0.6, Math.min(0.6, (e.clientX - lastX) * 0.012));
      lastX = e.clientX;
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(paso); });
    io.observe(el);
    window.addEventListener('pointermove', mover, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('pointermove', mover); };
  }, []);

  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero__fondo" aria-hidden="true"><Foto id={F.s4} arte="steak" alt="" w={1800} eager /></div>
      <span className="hero__velo" aria-hidden="true" />
      <span className="hero__humo h1" aria-hidden="true" /><span className="hero__humo h2" aria-hidden="true" />
      <div className="hero__colgante">
        <span className="hero__viga" aria-hidden="true" />
        <div ref={sign} className="hero__letrero">
          <span className="cadena l" /><span className="cadena r" />
          <Letrero />
        </div>
      </div>
      <div className="wrap hero__copy">
        <p className="eyebrow intro" style={{ '--d': '.2s' }}>Steakhouse · Beer House · Desde {CONFIG.desde}</p>
        <h1 className="hero__h1">
          <span className="ln"><span style={{ '--i': 0 }}>Cortes Angus</span></span>
          <span className="ln"><span style={{ '--i': 1 }}>al carbón <em>que se recuerdan.</em></span></span>
        </h1>
        <div className="hero__cta intro" style={{ '--d': '.95s' }}>
          <button type="button" className="btn btn--rojo" onClick={() => scrollToTarget('#reserva')}>Reservar mesa</button>
          <button type="button" className="btn btn--linea" onClick={() => scrollToTarget('#carta')}>Ver la carta</button>
        </div>
        <ul className="hero__datos intro" style={{ '--d': '1.1s' }}>
          <li><b>{CONFIG.desde}</b><span>abrimos el fuego</span></li>
          <li><b>{SEDES.length}</b><span>sedes: {SEDES.map((s) => s.nombre).join(' y ')}</span></li>
          <li><b>{CONFIG.seguidores}</b><span>seguidores</span></li>
        </ul>
      </div>
    </section>
  );
}
