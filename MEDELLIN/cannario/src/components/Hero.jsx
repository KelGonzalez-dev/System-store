import { useEffect, useRef } from 'react';
import { HERO_ARCH, HERO_BG } from '../data';
import { useI18n } from '../i18n';
import { reducedMotion, scrollToTarget } from '../lib/scroll';

// Pocos pájaros dorados planeando detrás del titular: continúan la historia del loading
function HeroBirds() {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const c = ref.current;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, visible = true, last = performance.now();
    const resize = () => {
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const mobile = W < 720;
    const birds = Array.from({ length: mobile ? 9 : 16 }, (_, i) => ({
      x: Math.random() * W, y: H * (0.08 + Math.random() * 0.5),
      v: 0.25 + Math.random() * 0.35, s: (mobile ? 4 : 5) + Math.random() * 5,
      ph: Math.random() * 6.28, fs: 0.06 + Math.random() * 0.05, a: 0.35 + Math.random() * 0.45, drift: Math.random() * 6.28, i,
    }));
    const loop = (now) => {
      const f = Math.min(3, (now - last) / 16.667); last = now;
      ctx.clearRect(0, 0, W, H);
      for (const b of birds) {
        b.x -= b.v * f; b.drift += 0.006 * f;
        b.y += Math.sin(b.drift) * 0.18 * f;
        if (b.x < -30) { b.x = W + 30; b.y = H * (0.08 + Math.random() * 0.5); }
        // planeo: aletea a ratos y luego se deja llevar
        const glide = Math.max(0, Math.sin(now * 0.0006 + b.i));
        b.ph += b.fs * f * (0.3 + glide * 1.7);
        const flap = Math.sin(b.ph) * (0.25 + glide * 0.75);
        const s = b.s, tip = -s * 0.5 * flap - s * 0.12;
        ctx.globalAlpha = b.a;
        ctx.beginPath();
        ctx.moveTo(b.x - s, b.y + tip);
        ctx.quadraticCurveTo(b.x - s * 0.45, b.y - s * 0.36, b.x, b.y);
        ctx.quadraticCurveTo(b.x + s * 0.45, b.y - s * 0.36, b.x + s, b.y + tip);
        ctx.stroke();
      }
      if (visible) raf = requestAnimationFrame(loop);
    };
    ctx.strokeStyle = '#E4C07A'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(c);
    const onResize = () => { resize(); ctx.strokeStyle = '#E4C07A'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="hero-birds pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

// Emblema circular a la derecha: el letrero real de Cannario dentro de un aro dorado que brilla,
// con un anillo de texto que gira y dos etiquetas flotantes
function Emblem({ t }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const el = ref.current;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      el.style.transform = `perspective(900px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  const ring = t.hero.ring;
  return (
    <div className="emblem intro-pop" aria-hidden="true">
      <div ref={ref} className="emblem-tilt">
        <svg viewBox="0 0 200 200" className="emblem-text">
          <defs><path id="circ" d="M100 100m-92 0a92 92 0 1 1 184 0a92 92 0 1 1-184 0" /></defs>
          <text><textPath href="#circ" textLength="578">{ring}</textPath></text>
        </svg>
        <div className="emblem-ring" />
        <div className="emblem-photo"><img src={HERO_ARCH} alt="" decoding="async" /></div>
        <span className="emblem-tag tag-a">{t.hero.tags[0]}</span>
        <span className="emblem-tag tag-b">{t.hero.tags[1]}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const go = (h) => (e) => { e.preventDefault(); scrollToTarget(h); };

  return (
    <section id="inicio" className="hero relative flex min-h-[100svh] items-center overflow-hidden bg-ash-deep text-stone-soft">
      <div className="hero-bg" aria-hidden="true"><img src={HERO_BG} alt="" fetchpriority="high" /></div>
      <div className="hero-shade" aria-hidden="true" />
      <HeroBirds />

      <div key={lang} className="relative wrap grid items-center gap-12 pb-14 pt-[calc(96px+env(safe-area-inset-top,0px))] lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pb-12">
        <div>
          <p className="intro-up eyebrow" style={{ '--d': '0.2s' }}>{t.hero.eyebrow}</p>
          <h1 className="hero-h1 font-display">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>{t.hero.l1}</span></span>
            <span className="hl"><em className="hl-in gold-glow" style={{ '--i': 1 }}>{t.hero.l2}</em></span>
          </h1>
          <svg viewBox="0 0 300 14" className="hero-swash" aria-hidden="true"><path d="M2 9C60 2 110 13 160 7S260 2 298 8" pathLength="1" /></svg>
          <p className="intro-up mt-6 max-w-[46ch] text-[clamp(16px,1.35vw,18px)] font-light leading-relaxed text-stone/80" style={{ '--d': '1.1s' }}>{t.hero.sub}</p>
          <div className="intro-up mt-8 flex flex-wrap gap-3.5" style={{ '--d': '1.25s' }}>
            <a href="#reservas" onClick={go('#reservas')} className="btn btn-goldgrad">{t.hero.c1}</a>
            <a href="#carta" onClick={go('#carta')} className="btn btn-ghost-light">{t.hero.c2}</a>
          </div>
          <p className="intro-up mt-7 font-display text-[15px] italic text-stone/55" style={{ '--d': '1.4s' }}>{t.hero.trust}</p>
        </div>
        <Emblem t={t} />
      </div>
    </section>
  );
}
