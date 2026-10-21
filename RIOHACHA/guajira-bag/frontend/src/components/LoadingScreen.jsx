import { useEffect, useRef, useState } from 'react';

const DEFAULT_LINES = ['Tejido a mano en La Guajira', 'Cada mochila, una pieza única', 'Hecho con amor y paciencia'];
const COLORS = ['#f3d5c8', '#e7b3a3', '#c98773', '#f8e4da', '#d9b35e', '#efc9b8', '#fbeee6'];
const LAYERS = 7; // grosor de la moneda

/**
 * Loader "Remolino de pétalos":
 * pétalos en tonos rubor, rosa y dorado llegan girando en remolino desde los bordes y forman una corona;
 * en el centro cae el emblema de Guajira Bags girando como una moneda de oro (con grosor real en 3D),
 * se asienta con un destello y un brillo metálico lo recorre. Al terminar, los pétalos se dispersan
 * con el viento y la página aparece.
 * Los pétalos se dibujan en un solo canvas que se detiene apenas termina.
 */
export default function LoadingScreen({ label = 'Guajira Bags', sub, ms = 3000, lines, leaving }) {
  const [i, setI] = useState(0);
  const canvas = useRef(null);
  const leavingRef = useRef(false);
  const phrases = lines && lines.length ? lines : DEFAULT_LINES;
  leavingRef.current = !!leaving;

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const iv = setInterval(() => setI((n) => (n + 1) % phrases.length), Math.max(1100, ms / phrases.length));
    return () => { clearInterval(iv); document.documentElement.style.overflow = ''; };
  }, [ms, phrases.length]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, cx = 0, cy = 0, R = 0;
    const size = () => {
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H * 0.42;
      R = Math.min(W * 0.36, 170);
    };
    size();
    window.addEventListener('resize', size);

    const N = reduce ? 0 : (W < 700 ? 70 : 120);
    const petals = Array.from({ length: N }, (_, k) => {
      const ang = (k / N) * Math.PI * 2;
      const far = Math.hypot(W, H) * (0.6 + Math.random() * 0.3);
      return {
        ang,                                          // lugar en la corona
        r0: far,                                      // distancia inicial (fuera de la pantalla)
        a0: ang - 2.4 - Math.random() * 1.6,          // llega girando en espiral
        ring: R * (0.82 + Math.random() * 0.42),      // radio en la corona (con variación)
        len: 7 + Math.random() * 9,
        wid: 0.45 + Math.random() * 0.25,
        col: COLORS[k % COLORS.length],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.06,
        flip: Math.random() * Math.PI * 2,
        vf: 0.04 + Math.random() * 0.06,
        delay: Math.random() * 520,
        dur: 1150 + Math.random() * 500,
        burst: 2 + Math.random() * 5,
        lift: (Math.random() - 0.3) * 2,
      };
    });

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    let t0 = performance.now();
    let tOut = 0;
    let spin = 0;

    const draw = (now) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);
      const out = leavingRef.current;
      if (out && !tOut) tOut = now;
      const to = tOut ? (now - tOut) / 900 : 0;
      spin += 0.0016;
      let vivos = 0;
      for (const p of petals) {
        const e = easeOut(Math.min(1, Math.max(0, (t - p.delay) / p.dur)));
        let r = p.r0 + (p.ring - p.r0) * e + Math.sin(t / 700 + p.ang * 3) * 4 * e;
        let a = p.a0 + (p.ang - p.a0) * e + spin * e;
        let alpha = Math.min(1, e * 1.6);
        if (tOut) {
          r += Math.pow(to, 1.6) * p.burst * 160;
          a += to * 0.6;
          alpha *= Math.max(0, 1 - to * 1.1);
        }
        if (alpha <= 0.01) continue;
        vivos++;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.92 - (tOut ? to * to * 60 * p.lift : 0);
        p.rot += p.vr; p.flip += p.vf;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rot + a);
        ctx.scale(Math.max(0.18, Math.abs(Math.cos(p.flip))), 1);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, -p.len);
        ctx.quadraticCurveTo(p.len * p.wid * 1.6, -p.len * 0.2, 0, p.len);
        ctx.quadraticCurveTo(-p.len * p.wid * 1.6, -p.len * 0.2, 0, -p.len);
        ctx.fillStyle = p.col;
        ctx.fill();
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, -p.len * 0.7); ctx.lineTo(0, p.len * 0.6); ctx.stroke();
        ctx.restore();
      }
      if (tOut && vivos === 0) return; // terminó: no seguir dibujando
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);

  return (
    <div className={`ld${leaving ? ' ld--out' : ''}`} role="status" aria-live="polite" style={{ '--ms': `${ms}ms`, '--s': Math.max(0.5, Math.min(1, ms / 3600)) }}>
      <span className="ld__glow" aria-hidden="true" />
      <canvas ref={canvas} className="ld__petals" aria-hidden="true" />
      <div className="ld__center">
        <div className="ld__stage" aria-hidden="true">
          <span className="ld__halo" />
          <div className="ld__coin">
            {Array.from({ length: LAYERS }, (_, k) => (
              <img key={k} src="/images/emblema-512.webp" alt="" width="512" height="512" fetchpriority={k === LAYERS - 1 ? 'high' : undefined}
                className={k === LAYERS - 1 ? 'face' : 'edge'} style={{ '--z': `${(k - LAYERS + 1) * 1.1}px`, '--d': (LAYERS - 1 - k) / LAYERS }} />
            ))}
            <span className="ld__shine" />
          </div>
          <span className="ld__shadow" />
        </div>
        <p className="ld__word" aria-hidden="true">
          {label.split('').map((c, k) => <span key={k} style={{ '--k': k }}>{c === ' ' ? '\u00a0' : c}</span>)}
        </p>
        <p className="ld__line"><span key={i}>{phrases[i]}</span></p>
        <span className="ld__bar" aria-hidden="true"><i /></span>
        <span className="sr">{label}{sub ? ` — ${sub}` : ''}</span>
      </div>
    </div>
  );
}
