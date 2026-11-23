import { useEffect, useRef, useState } from 'react';
import { Sello } from './Logo';
import { lockScroll, reducedMotion } from '../lib/scroll';

const GOTAS = Array.from({ length: 16 }, (_, i) => ({
  x: (i / 16) * 100 + ((i * 37) % 5),
  w: 4 + ((i * 53) % 5),
  h: 16 + ((i * 29) % 26),
  d: 0.55 + ((i * 17) % 9) / 14,
}));

/**
 * Loader "Avalancha de queso":
 * la plancha se calienta (contador hasta 188 °C), una cascada de queso cheddar cae desde arriba y
 * gotea por la pantalla, el sello de 88 Burger se estampa sobre el queso mientras llueve tocineta.
 * Al terminar, todo el queso se derrite hacia abajo y deja ver la página.
 */
export default function Loader({ onReveal, onDone }) {
  const [fase, setFase] = useState('in');
  const [temp, setTemp] = useState(0);
  const canvas = useRef(null);
  const fin = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let liberado = false;
    const liberar = () => { if (!liberado) { liberado = true; lockScroll(false); } };
    const timers = [];
    let hecho = false;
    const salir = () => {
      if (hecho) return;
      hecho = true;
      setFase('out');
      liberar();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 200 : 1300));
    };
    fin.current = salir;
    timers.push(setTimeout(salir, reduce ? 700 : 4200));

    // Contador de la plancha
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 2600);
      setTemp(Math.round(188 * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Lluvia de tocineta (canvas)
    const cv = canvas.current;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const N = reduce ? 0 : (W < 700 ? 40 : 80);
    const bits = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * H * 0.8,
      vy: 2 + Math.random() * 3.5, vx: (Math.random() - 0.5) * 0.8,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2,
      s: 5 + Math.random() * 9, c: Math.random() < 0.5 ? '#8E2F1C' : '#B4432B',
    }));
    let raf2 = 0;
    const t1 = performance.now();
    const llover = (now) => {
      ctx.clearRect(0, 0, W, H);
      if (now - t1 > 1200) {
        for (const b of bits) {
          b.vy += 0.12; b.y += b.vy; b.x += b.vx; b.r += b.vr;
          if (b.y > H + 20) continue;
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
          ctx.fillStyle = b.c;
          ctx.beginPath(); ctx.moveTo(-b.s, -b.s * 0.4); ctx.lineTo(b.s * 0.7, -b.s * 0.55); ctx.lineTo(b.s, b.s * 0.3); ctx.lineTo(-b.s * 0.6, b.s * 0.5); ctx.closePath(); ctx.fill();
          ctx.fillStyle = 'rgba(255,214,170,.55)'; ctx.fillRect(-b.s * 0.6, -b.s * 0.1, b.s * 1.2, b.s * 0.18);
          ctx.restore();
        }
      }
      if (now - t1 < 5200) raf2 = requestAnimationFrame(llover);
    };
    raf2 = requestAnimationFrame(llover);

    return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); cancelAnimationFrame(raf2); liberar(); };
  }, [onReveal, onDone]);

  return (
    <div className={`ld ld--${fase}`} role="status" aria-label="88 Burger">
      <svg width="0" height="0" className="ld__defs" aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" />
        </filter>
      </svg>
      <span className="ld__calor" aria-hidden="true" />
      <div className="ld__queso" aria-hidden="true">
        <span className="ld__lamina" />
        {GOTAS.map((g, i) => (
          <i key={i} style={{ left: `${g.x}%`, width: `${g.w}vw`, '--h': `${g.h}vh`, '--d': `${g.d}s` }} />
        ))}
      </div>
      <span className="ld__brillo" aria-hidden="true" />
      <canvas ref={canvas} className="ld__tocineta" aria-hidden="true" />
      <div className="ld__centro">
        <div className="ld__sello"><Sello /></div>
        <p className="ld__nombre" aria-hidden="true">{'NO ES UNA HAMBURGUESA MÁS'.split('').map((c, i) => <span key={i} style={{ '--i': i }}>{c === ' ' ? '\u00a0' : c}</span>)}</p>
      </div>
      <div className="ld__plancha" aria-hidden="true">
        <span>PLANCHA</span><b>{temp}°C</b><i><em style={{ transform: `scaleX(${temp / 188})` }} /></i>
      </div>
      <button type="button" className="ld__saltar" onClick={() => fin.current()}>Entrar</button>
    </div>
  );
}
