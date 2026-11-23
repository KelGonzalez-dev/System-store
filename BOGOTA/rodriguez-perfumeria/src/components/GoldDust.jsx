import { useEffect, useRef } from 'react';

export default function GoldDust({ count = 60, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, running = false, inView = false;
    const P = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.6,
      s: 0.015 + Math.random() * 0.05, a: 0.25 + Math.random() * 0.6, ph: Math.random() * 6.28,
    }));

    const resize = () => {
      const b = cv.getBoundingClientRect();
      w = b.width; h = b.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#f1d9a0';
      for (const p of P) {
        p.y -= p.s * dt;
        p.x += Math.sin(now / 2200 + p.ph) * dt * 0.012;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(now / 700 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const should = inView && !document.hidden;
      if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!should && running) { running = false; cancelAnimationFrame(raf); }
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    resize();
    io.observe(cv);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sync);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
