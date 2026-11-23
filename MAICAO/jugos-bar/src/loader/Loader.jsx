import { useEffect, useRef, useState } from 'react';
import { LogoLoader } from '../components/Logo';

const MIN = 3300;
const MAX = 6500;
const LEAVE = 1200;

export default function Loader({ onLeave }) {
  const [phase, setPhase] = useState('play');
  const root = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const min = reduce ? 500 : MIN;
    const t0 = performance.now();
    let dead = false;
    let loaded = false;
    let timer = 0;

    const ready = Promise.all([
      document.fonts && document.fonts.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve(),
      new Promise((res) => {
        const im = new Image();
        im.onload = im.onerror = res;
        im.src = 'https://images.unsplash.com/photo-1598793929269-8e2a4b5a20e4?auto=format&fit=crop&q=70&w=900';
        setTimeout(res, 3000);
      }),
    ]);

    const leave = () => {
      if (dead) return;
      if (ring.current && root.current) {
        const r = ring.current.getBoundingClientRect();
        root.current.style.setProperty('--ox', `${r.left + r.width / 2}px`);
        root.current.style.setProperty('--oy', `${r.top + r.height / 2}px`);
      }
      setPhase('leaving');
      onLeave?.();
      timer = setTimeout(() => !dead && setPhase('gone'), LEAVE);
    };

    ready.then(() => {
      loaded = true;
      const wait = Math.max(0, min - (performance.now() - t0));
      timer = setTimeout(leave, wait);
    });
    const cap = setTimeout(() => { if (!loaded) leave(); }, MAX);

    return () => {
      dead = true;
      clearTimeout(timer);
      clearTimeout(cap);
      html.style.overflow = '';
    };
  }, [onLeave]);

  if (phase === 'gone') return null;

  return (
    <div ref={root} className={`ld-root ${phase === 'leaving' ? 'ld-leaving' : ''}`} role="status" aria-live="polite" aria-label="Cargando Jugos Bar">
      <LogoLoader ringRef={ring} />
      <p className="ld-tag">Exprimiendo sabor</p>
    </div>
  );
}
