import { useEffect, useRef, useState } from 'react';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { spray0: 500, sprayLen: 1700, exit: 4800, exitLen: 1100 };
const COLORS = ['#c8693f', '#d99a6c', '#e9c9b9', '#c9a25f', '#7c9a7e', '#b5577a'];

/**
 * Loader "Una gota de perfume":
 * un frasco aparece en el centro y su atomizador se presiona; de la boquilla sale una nube de partículas
 * de colores que viaja en curva y se ordena hasta escribir "Zulima" en el aire. Brotan hojas alrededor,
 * aparece "Belleza natural para ti" y al final la fragancia se dispersa hacia arriba y revela la página.
 */
export default function Loader({ onReveal, onDone }) {
  const [phase, setPhase] = useState('in');
  const canvasRef = useRef(null);
  const nozzleRef = useRef(null);
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = W < 720;
    let parts = [];
    let raf = 0;
    let exitAt = 0;
    const t0 = performance.now();

    // 1) puntos de la palabra "Zulima" a partir de la letra cursiva
    const build = () => {
      const off = document.createElement('canvas');
      const fs = Math.min(W * (mobile ? 0.3 : 0.17), H * 0.24);
      off.width = W; off.height = fs * 1.6;
      const o = off.getContext('2d');
      o.fillStyle = '#000';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.font = `${fs}px "Pinyon Script", cursive`;
      o.fillText('Zulima', W / 2, off.height / 2);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = 3;
      const pts = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 140) pts.push([x, y]);
        }
      }
      const max = mobile ? 1300 : 2600;
      for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
      const top = H * (mobile ? 0.3 : 0.27) - off.height / 2;
      const nz = nozzleRef.current?.getBoundingClientRect();
      const sx = nz ? nz.left + nz.width / 2 : W / 2, sy = nz ? nz.top + nz.height / 2 : H * 0.62;
      parts = pts.slice(0, max).map(([x, y], i) => ({
        tx: x, ty: y + top, sx, sy,
        cx: sx + (Math.random() - 0.5) * W * 0.5, cy: sy - H * (0.15 + Math.random() * 0.35), // punto de control de la curva
        delay: (i / max) * T.sprayLen + Math.random() * 120,
        dur: 900 + Math.random() * 600,
        r: 0.8 + Math.random() * 1.1,
        col: COLORS[(Math.random() * COLORS.length) | 0],
        vx: (Math.random() - 0.5) * 2, vy: -(1 + Math.random() * 3),
        ph: Math.random() * 6.28,
      }));
    };

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const frame = (now) => {
      const el = now - t0 - T.spray0;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      for (const p of parts) {
        const k = Math.max(0, Math.min(1, (el - p.delay) / p.dur));
        if (k <= 0) continue;
        let x, y, a = 1;
        if (exitAt) {
          const e = (now - exitAt) / T.exitLen;
          x = p.tx + p.vx * e * 160 + Math.sin(p.ph + e * 6) * 20 * e;
          y = p.ty + p.vy * e * 180;
          a = Math.max(0, 1 - e * 1.1);
        } else {
          const t = ease(k);
          const it = 1 - t;
          x = it * it * p.sx + 2 * it * t * p.cx + t * t * p.tx;
          y = it * it * p.sy + 2 * it * t * p.cy + t * t * p.ty;
          if (k >= 1) { x += Math.sin(now / 600 + p.ph) * 0.6; y += Math.cos(now / 700 + p.ph) * 0.6; }
          a = k < 1 ? 0.35 + k * 0.65 : 1;
        }
        ctx.globalAlpha = a;
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(x, y, p.r * (exitAt ? 1.3 : 1), 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!exitAt || now - exitAt < T.exitLen + 50) raf = requestAnimationFrame(frame);
    };

    const fontReady = document.fonts?.load ? document.fonts.load('80px "Pinyon Script"') : Promise.resolve();
    Promise.race([fontReady, new Promise((r) => setTimeout(r, 900))]).then(() => {
      if (reduce) return;
      build();
      raf = requestAnimationFrame(frame);
    });

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      exitAt = performance.now();
      setPhase('exit');
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 200 : T.exitLen + 150));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 700 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div className={`z-loader ph-${phase}`} role="status" aria-label="Zulima · Consultora Natura">
      <div className="zl-bg" aria-hidden="true" />
      <svg className="zl-leaves" viewBox="-200 0 800 200" aria-hidden="true">
        <path className="lf l1" d="M-120 160c10-60 70-90 120-80-30 20-50 60-120 80z" />
        <path className="lf l2" d="M520 150c-14-56-72-80-118-70 30 18 46 54 118 70z" />
        <path className="lf l3" d="M-60 30c30-20 70-14 86 8-32-2-58 4-86-8z" />
        <path className="lf l4" d="M470 26c-26-16-62-10-76 10 28-2 52 2 76-10z" />
      </svg>
      <canvas ref={canvasRef} className="zl-canvas" aria-hidden="true" />
      <div className="zl-bottle" aria-hidden="true">
        <span ref={nozzleRef} className="zl-nozzle" />
        <span className="zl-mist" />
        <svg viewBox="0 0 120 170">
          <defs>
            <linearGradient id="zlGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dccd" /><stop offset=".55" stopColor="#e3a98a" /><stop offset="1" stopColor="#c8693f" /></linearGradient>
          </defs>
          <g className="zl-cap"><rect x="50" y="6" width="20" height="14" rx="3" fill="#c9a25f" /><rect x="44" y="18" width="32" height="20" rx="6" fill="#b88a3f" /></g>
          <rect x="22" y="36" width="76" height="124" rx="18" fill="url(#zlGlass)" />
          <rect x="30" y="46" width="12" height="100" rx="6" fill="rgba(255,255,255,0.4)" />
          <text x="60" y="110" textAnchor="middle" className="zl-btxt">Z</text>
        </svg>
      </div>
      <p className="zl-tag">Belleza natural para ti</p>
      <p className="zl-sub">Consultora de belleza Natura</p>
      <button type="button" className="zl-skip" onClick={() => finish.current()}>Entrar</button>
    </div>
  );
}
