import { useEffect, useRef } from 'react';
import Photo from './Photo';
import { MOOD, PRODUCTS } from '../data';
import { reducedMotion, scrollToTarget } from '../lib/scroll';

const ORBIT = [6, 12, 17, 20, 2, 23, 27, 8, 14, 10].map((id) => PRODUCTS.find((p) => p.id === id));
const STAR = PRODUCTS.find((p) => p.id === 1);

/**
 * Hero "Órbita": el perfume protagonista flota al centro y diez productos giran a su alrededor en un anillo 3D.
 * Al bajar, el anillo se acelera, se inclina y se abre; con el mouse cambia de perspectiva.
 */
export default function Hero() {
  const sec = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const items = [...ring.current.children];
    const reduce = reducedMotion();
    let raf = 0, a = 0, last = performance.now(), visible = true, mx = 0, my = 0, cmx = 0, cmy = 0;
    const N = items.length;
    const frame = (now) => {
      const dt = Math.min(48, now - last); last = now;
      const rect = sec.current.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height))); // 0 arriba → 1 al salir
      a += dt * (0.00018 + k * 0.0012);
      cmx += (mx - cmx) * 0.06; cmy += (my - cmy) * 0.06;
      const vw = window.innerWidth;
      const R = Math.min(vw * (vw < 720 ? 0.4 : 0.32), 460) * (1 + k * 0.5);
      for (let i = 0; i < N; i++) {
        const ang = a + (i / N) * Math.PI * 2;
        const x = Math.cos(ang) * R, z = Math.sin(ang) * R;
        const y = Math.sin(ang) * R * (0.09 + k * 0.2 + cmy * 0.05);
        items[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`;
        items[i].style.opacity = (0.55 + ((Math.sin(ang) + 1) / 2) * 0.45).toFixed(2);
      }
      ring.current.style.transform = `rotateX(${(-8 - k * 18 + cmy * 6).toFixed(2)}deg) rotateY(${(cmx * 10).toFixed(2)}deg)`;
      sec.current.style.setProperty('--k', k.toFixed(3));
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); } });
    io.observe(sec.current);
    const move = (e) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; };
    if (window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);
  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <svg className="hero-leaves" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path className="hl1" d="M-40 640c120-160 300-200 420-150-110 30-220 120-420 150z" />
        <path className="hl2" d="M1240 520c-120-150-300-190-420-140 110 30 220 110 420 140z" />
        <path className="hl3" d="M120 120c90-60 190-50 240 10-90-10-160 0-240-10z" />
        <path className="hl4" d="M1100 140c-80-60-180-50-230 10 80-10 150 0 230-10z" />
      </svg>
      <div className="hero-text wrap">
        <p className="eyebrow intro" style={{ '--d': '0.15s' }}>Consultora de belleza Natura</p>
        <h1 className="hero-h1">
          <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>Belleza que nace</span></span>
          <span className="hl"><span className="hl-in" style={{ '--i': 1 }}>de la <em>naturaleza</em></span></span>
        </h1>
      </div>
      <div className="orbit-stage intro-pop" aria-hidden="true">
        <div className="orbit-glow" />
        <div className="orbit-star"><Photo id={MOOD.hero} art={STAR.art} label={STAR.line} w={900} eager /><span className="star-ring" /></div>
        <div ref={ring} className="orbit-ring">
          {ORBIT.map((p) => <div key={p.id} className="orbit-item"><Photo id={p.img} art={p.art} label={p.line} w={260} /></div>)}
        </div>
      </div>
      <div className="hero-foot wrap intro" style={{ '--d': '1.1s' }}>
        <p>Perfumes, cremas, jabones y cuidado personal para ella y para él, con asesoría personalizada y entrega a tu puerta.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#catalogo" onClick={(e) => { e.preventDefault(); scrollToTarget('#catalogo'); }} className="btn btn-terra">Ver catálogo</a>
          <a href="#aroma" onClick={(e) => { e.preventDefault(); scrollToTarget('#aroma'); }} className="btn btn-line">Encuentra tu aroma</a>
        </div>
      </div>
    </section>
  );
}
