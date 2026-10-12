import { useEffect, useRef, useState } from 'react';
import Logo, { FLAME } from './Logo';
import { useI18n } from '../i18n';
import { clamp, easeInOut, lockScroll, reducedMotion } from '../lib/scroll';

// Línea de tiempo (ms)
const T = { typeStart: 1300, typeStep: 165, converge: 2000, convergeLen: 1700, logo: 3500, tag: 3650, exit: 5100, exitLen: 1250 };
const NAME = 'cannario';
const BG = [31, 30, 29]; // #1F1E1D carbón ceniza

// Muestrea puntos dentro del emblema para que cada pájaro tenga su lugar
function sampleLogo(count) {
  const S = 180;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.scale(S / 100, S / 100);
  FLAME.slice(0, 5).forEach((d) => x.fill(new Path2D(d)));
  x.lineWidth = 3.4; x.lineCap = 'round';
  x.stroke(new Path2D(FLAME[5]));
  const data = x.getImageData(0, 0, S, S).data;
  const pts = [];
  for (let py = 0; py < S; py += 2) for (let px = 0; px < S; px += 2) if (data[(py * S + px) * 4 + 3] > 140) pts.push([px / S, py / S]);
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return Array.from({ length: count }, (_, i) => pts[i % pts.length]);
}

export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const canvasRef = useRef(null);
  const [geo, setGeo] = useState(null);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState('fly'); // fly → logo → tag → exit
  const doneRef = useRef(false);

  const finish = useRef(() => {});
  const unlockRef = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, L = 0, cx = 0, cy = 0;
    const mobile = window.innerWidth < 720;
    const N = reduce ? 0 : mobile ? 150 : 280;

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      L = Math.min(W * (mobile ? 0.5 : 0.3), H * 0.3);
      cx = W / 2; cy = H * (mobile ? 0.36 : 0.38);
      setGeo({ L, cx, cy });
      ctx.fillStyle = `rgb(${BG})`; ctx.fillRect(0, 0, W, H);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pájaros
    const targets = sampleLogo(N);
    const birds = targets.map((tp, i) => {
      const fromLeft = i % 2 === 0;
      return {
        x: fromLeft ? -40 - Math.random() * W * 0.5 : W + 40 + Math.random() * W * 0.5,
        y: H * (0.25 + Math.random() * 0.75),
        vx: fromLeft ? 3 + Math.random() * 2 : -3 - Math.random() * 2, vy: -Math.random() * 1.5,
        ox: (Math.random() - 0.5) * 2, oy: (Math.random() - 0.5) * 2, // posición dentro de la bandada
        ph: Math.random() * Math.PI * 2, fs: 0.28 + Math.random() * 0.16, // aleteo
        s: (mobile ? 3 : 4) + Math.random() * (mobile ? 2.4 : 3.4),
        k: 0.7 + Math.random() * 0.6, tp,
      };
    });
    // Polvo dorado de fondo
    const dust = Array.from({ length: mobile ? 26 : 50 }, () => ({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.3, v: 0.00004 + Math.random() * 0.0001, a: 0.15 + Math.random() * 0.45 }));

    const t0 = performance.now();
    let last = t0, raf = 0, step = 0;

    const loop = (now) => {
      const el = now - t0;
      const f = Math.min(3, (now - last) / 16.667); last = now;
      const m = easeInOut(clamp((el - T.converge) / T.convergeLen)); // 0 bandada → 1 emblema
      const settle = clamp((el - T.converge - T.convergeLen) / 400);

      // Estela: pintar el fondo con transparencia deja rastros suaves de vuelo
      ctx.fillStyle = `rgba(${BG},${0.3 + m * 0.5})`;
      ctx.fillRect(0, 0, W, H);

      // Polvo
      ctx.fillStyle = '#E4C07A';
      for (const d of dust) {
        d.y -= d.v * f * 16; if (d.y < -0.02) d.y = 1.02;
        ctx.globalAlpha = d.a * (1 - settle * 0.4);
        ctx.fillRect(d.x * W, d.y * H, d.r, d.r);
      }
      ctx.globalAlpha = 1;

      // Atractor en forma de ocho: la bandada dibuja una murmuración
      const at = el * 0.00075;
      const ax = cx + Math.cos(at) * W * 0.26;
      const ay = cy + Math.sin(at * 2) * H * 0.12;
      const spin = el * 0.0006;
      const cs = Math.cos(spin), sn = Math.sin(spin);
      const spread = Math.min(W, H) * 0.2;

      ctx.beginPath();
      for (const b of birds) {
        const breathe = 1 + 0.35 * Math.sin(el * 0.002 + b.k * 6);
        const fx = ax + (b.ox * cs - b.oy * sn) * spread * breathe;
        const fy = ay + (b.ox * sn + b.oy * cs) * spread * 0.6 * breathe;
        const tx = cx + (b.tp[0] - 0.5) * L;
        const ty = cy + (b.tp[1] - 0.5) * L;
        const dx = fx + (tx - fx) * m, dy = fy + (ty - fy) * m;
        const kk = (0.0016 + m * 0.02) * b.k;
        b.vx = (b.vx + (dx - b.x) * kk * f) * Math.pow(0.955 - m * 0.13, f);
        b.vy = (b.vy + (dy - b.y) * kk * f) * Math.pow(0.955 - m * 0.13, f);
        b.x += b.vx * f; b.y += b.vy * f;
        if (settle > 0) { b.x += (tx - b.x) * 0.25 * settle; b.y += (ty - b.y) * 0.25 * settle; }

        // Dibujo del pájaro: dos alas que aletean, orientadas con el vuelo
        b.ph += b.fs * f * (1 - m * 0.75);
        const s = b.s * (1 - m * 0.72);
        const flap = Math.sin(b.ph);
        const tipY = -s * 0.55 * flap - s * 0.1;
        const rot = clamp(Math.atan2(b.vy, Math.abs(b.vx) + 0.001), -0.6, 0.6) * Math.sign(b.vx || 1) * 0.5;
        const rc = Math.cos(rot), rs = Math.sin(rot);
        const P = (px, py) => [b.x + px * rc - py * rs, b.y + px * rs + py * rc];
        const [l1, l2] = P(-s, tipY), [c1, c2] = P(-s * 0.45, -s * 0.38 - flap * s * 0.12), [o1, o2] = P(0, 0);
        const [c3, c4] = P(s * 0.45, -s * 0.38 - flap * s * 0.12), [r1, r2] = P(s, tipY);
        ctx.moveTo(l1, l2); ctx.quadraticCurveTo(c1, c2, o1, o2); ctx.quadraticCurveTo(c3, c4, r1, r2);
      }
      ctx.strokeStyle = '#E4C07A';
      ctx.lineWidth = mobile ? 1.1 : 1.25;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Fases de la interfaz (solo cambia el estado cuando hace falta)
      if (step === 0 && el > T.logo) { step = 1; setPhase('logo'); }
      if (step === 1 && el > T.tag) { step = 2; setPhase('tag'); }
      if (el < T.exit + 200) raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    // Nombre que se escribe letra por letra
    const timers = [];
    const typeStart = reduce ? 0 : T.typeStart;
    for (let i = 1; i <= NAME.length; i++) timers.push(setTimeout(() => setTyped(i), typeStart + (reduce ? 0 : i * T.typeStep)));
    if (reduce) { setPhase('tag'); }

    const exitAt = reduce ? 900 : T.exit;
    const go = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPhase('exit');
      unlockRef.current();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 300 : T.exitLen + 50));
    };
    finish.current = go;
    timers.push(setTimeout(go, exitAt));

    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    unlockRef.current = unlock;
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', resize);
      unlock();
    };
  }, [onReveal, onDone]);

  const showLogo = phase !== 'fly';
  const exiting = phase === 'exit';

  return (
    <div className={`loader ${exiting ? 'is-exit' : ''}`} role="status" aria-live="polite" aria-label="Cannario">
      <canvas ref={canvasRef} className={`absolute inset-0 transition-opacity duration-700 ${showLogo ? 'opacity-40' : ''}`} aria-hidden="true" />

      {geo && (
        <>
          <div className="pointer-events-none absolute" style={{ left: geo.cx - geo.L / 2, top: geo.cy - geo.L / 2, width: geo.L, height: geo.L }}>
            <div className={`loader-logo ${showLogo ? 'on' : ''}`}><Logo className="h-full w-full" /></div>
          </div>

          <div className="absolute inset-x-0 flex flex-col items-center px-6 text-center" style={{ top: geo.cy + geo.L / 2 + Math.min(40, geo.L * 0.16) }}>
            <p className="loader-name font-display" aria-label={NAME}>
              {NAME.split('').map((ch, i) => (
                <span key={i} className="contents">
                  {i === typed && <i className="caret" aria-hidden="true" />}
                  <span className={`lt ${i < typed ? 'on' : ''}`} aria-hidden="true">{ch}</span>
                </span>
              ))}
              {typed === NAME.length && <i className={`caret ${phase === 'tag' || exiting ? 'off' : ''}`} aria-hidden="true" />}
            </p>
            <p className={`loader-tag ${phase === 'tag' || exiting ? 'on' : ''}`}>{t.loader.tag}</p>
          </div>
        </>
      )}

      <button type="button" onClick={() => finish.current()} className="loader-skip">{t.loader.skip}</button>
    </div>
  );
}
