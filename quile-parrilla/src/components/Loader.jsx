import { useEffect, useRef, useState } from 'react';
import { QuileLogo } from './Brand';
import { createEmbers } from '../lib/embers';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { heat: 3900, exit: 4700, burn: 1250 };

// Ruido suave (value noise) para el borde del fuego que "quema" la pantalla al salir
function noiseField(w, h, seed = 7) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const grid = (gw, gh) => Array.from({ length: (gw + 1) * (gh + 1) }, rnd);
  const octs = [[6, 4, 0.55], [12, 8, 0.3], [24, 16, 0.15]].map(([gw, gh, amp]) => ({ gw, gh, amp, g: grid(gw, gh) }));
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (const o of octs) {
        const fx = (x / w) * o.gw, fy = (y / h) * o.gh;
        const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
        const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
        const i = y0 * (o.gw + 1) + x0;
        const a = o.g[i], b = o.g[i + 1], c = o.g[i + o.gw + 1], d = o.g[i + o.gw + 2];
        v += o.amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy);
      }
      // el fuego empieza en el centro y avanza hacia los bordes
      const dx = x / w - 0.5, dy = (y / h - 0.48) * 0.8;
      out[y * w + x] = v * 0.6 + Math.sqrt(dx * dx + dy * dy) * 0.9;
    }
  }
  return out;
}

// Loader "marcado a fuego": brasas que suben, el logo aparece al rojo vivo y se enfría hasta su azul,
// la llama se enciende, cuelga la tablilla y al final la pantalla se quema y revela la página.
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const embersRef = useRef(null);
  const burnRef = useRef(null);
  const pctRef = useRef(null);
  const boxRef = useRef(null);
  const [phase, setPhase] = useState('heat');
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    const mobile = window.innerWidth < 720;
    const embers = createEmbers(embersRef.current, { count: mobile ? 55 : 110, intensity: 0.3 });
    if (!reduce) embers.start();

    // calor que sube + porcentaje
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / (reduce ? 1 : T.heat));
      embers.set(0.3 + p * 0.9);
      if (pctRef.current) pctRef.current.textContent = `${Math.round((1 - Math.pow(1 - p, 2)) * 100)}%`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // salida: la pantalla se "quema" desde el centro con borde de fuego
    const burn = () => {
      const c = burnRef.current;
      const W = 224, H = 126;
      const field = noiseField(W, H);
      const off = document.createElement('canvas'); off.width = W; off.height = H;
      const octx = off.getContext('2d');
      const img = octx.createImageData(W, H);
      const ctx = c.getContext('2d');
      const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; ctx.imageSmoothingEnabled = true; };
      resize();
      const b0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - b0) / T.burn);
        const th = 0.12 + k * 1.0;
        const d = img.data;
        for (let i = 0; i < W * H; i++) {
          const v = field[i], o = i * 4;
          if (v < th - 0.07) { d[o + 3] = 0; continue; }
          if (v < th) {
            const e = (v - (th - 0.07)) / 0.07; // 0 = interior quemado, 1 = borde
            d[o] = 255; d[o + 1] = 120 + 120 * (1 - e); d[o + 2] = 40 * (1 - e); d[o + 3] = 255 * (0.35 + e * 0.65);
            continue;
          }
          d[o] = 13; d[o + 1] = 9; d[o + 2] = 7; d[o + 3] = 255;
        }
        octx.putImageData(img, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(off, 0, 0, c.width, c.height);
        if (boxRef.current && !boxRef.current.classList.contains('is-burning')) boxRef.current.classList.add('is-burning');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setPhase('exit');
      unlock();
      onReveal();
      if (reduce) { timers.push(setTimeout(onDone, 200)); return; }
      burn();
      timers.push(setTimeout(() => { embers.stop(); onDone(); }, T.burn + 80));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 800 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); embers.stop(); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div ref={boxRef} className={`qp-loader ph-${phase}`} role="status" aria-label="Quile Parrilla">
      <div className="ld-heat" aria-hidden="true" />
      <canvas ref={embersRef} className="ld-embers" aria-hidden="true" />
      <div className="ld-grill" aria-hidden="true" />
      <div className="ld-center">
        <div className="ld-logo"><QuileLogo /></div>
        <p className="ld-tag font-script">{t.loader.tag}</p>
        <p className="ld-pct"><span>{t.loader.heat}</span><b ref={pctRef}>0%</b></p>
      </div>
      <canvas ref={burnRef} className="ld-burn" aria-hidden="true" />
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
