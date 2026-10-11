import { useEffect, useRef, useState } from 'react';
import { QuileLogo } from './Brand';
import { createEmbers } from '../lib/embers';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

// Línea de tiempo (ms)
const T = { spark: 650, write0: 1000, writeLen: 1500, flame: 2550, exit: 5000, surge: 520, burn: 1200 };

// ---------- Fuego real: simulación tipo "llama de píxeles" a baja resolución, escalada y suavizada ----------
const PALETTE = (() => {
  const stops = [[0, 7, 7, 7], [6, 47, 15, 7], [11, 103, 31, 7], [16, 159, 47, 7], [20, 199, 71, 7], [24, 223, 87, 7], [28, 223, 111, 15], [31, 215, 135, 23], [33, 207, 151, 39], [35, 199, 175, 47], [36, 255, 255, 215]];
  const out = [];
  for (let i = 0; i <= 36; i++) {
    let a = stops[0], b = stops[stops.length - 1];
    for (let k = 0; k < stops.length - 1; k++) if (i >= stops[k][0] && i <= stops[k + 1][0]) { a = stops[k]; b = stops[k + 1]; break; }
    const t = b[0] === a[0] ? 0 : (i - a[0]) / (b[0] - a[0]);
    out.push([0, 1, 2].map((c) => Math.round(a[c + 1] + (b[c + 1] - a[c + 1]) * t)));
  }
  return out;
})();

function createFire(canvas, mobile) {
  const W = mobile ? 90 : 140, H = mobile ? 70 : 90;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(W, H);
  const px = new Uint8Array(W * H);
  let level = 0, raf = 0, last = 0, running = false;
  const step = () => {
    // fuente: la fila de abajo arde según el nivel (más nivel = llamas más altas)
    const base = W * (H - 1);
    const src0 = Math.round(36 * level);
    for (let x = 0; x < W; x++) px[base + x] = Math.max(0, src0 - ((Math.random() * 3) | 0) * (level < 1 ? 1 : 0));
    // propagación hacia arriba con viento aleatorio (algoritmo clásico de "fuego de píxeles")
    for (let x = 0; x < W; x++) {
      for (let y = 1; y < H; y++) {
        const src = y * W + x;
        const r = (Math.random() * 3.99) | 0;
        const dst = src - r + 1;
        const t = dst - W;
        if (t >= 0) px[t] = Math.max(0, px[src] - (r === 3 ? 1 : 0));
      }
    }
    const d = img.data;
    for (let i = 0; i < W * H; i++) {
      const v = px[i], c = PALETTE[v], o = i * 4;
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = v === 0 ? 0 : Math.min(255, v * 18);
    }
    ctx.putImageData(img, 0, 0);
  };
  const loop = (now) => {
    if (now - last > (mobile ? 40 : 30)) { last = now; step(); } // ~25–33 fps: suficiente y liviano
    if (running) raf = requestAnimationFrame(loop);
  };
  return {
    start() { if (!running) { running = true; raf = requestAnimationFrame(loop); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    set(v) { level = v; },
  };
}

// ---------- Ruido suave para el borde de fuego que "quema" la pantalla al salir ----------
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
      // se quema desde abajo (donde está el fuego) hacia arriba, con bordes irregulares
      out[y * w + x] = v * 0.55 + (1 - y / h) * 0.75;
    }
  }
  return out;
}

const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Loader "Encendido":
 * 1. Cae una chispa en la oscuridad y enciende la parrilla (destello).
 * 2. Sube un fuego real desde abajo y las brasas se arremolinan.
 * 3. Una antorcha escribe el logo con chispas; la palabra sale al rojo vivo y se enfría hasta su azul.
 * 4. Se enciende la llama de la "i" con una explosión de chispas y cuelga la tablilla PARRILLA.
 * 5. El termómetro sube hasta 400 °C, el fuego crece, cubre la pantalla y la quema para revelar la página.
 */
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const boxRef = useRef(null);
  const embersRef = useRef(null);
  const fireRef = useRef(null);
  const burnRef = useRef(null);
  const logoRef = useRef(null);
  const torchRef = useRef(null);
  const tempRef = useRef(null);
  const [phase, setPhase] = useState('start');
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    const mobile = window.innerWidth < 720;
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    const embers = createEmbers(embersRef.current, { count: mobile ? 45 : 90, intensity: 0 });
    const fire = createFire(fireRef.current, mobile);
    if (!reduce) { embers.start(); fire.start(); }

    const t0 = performance.now();
    let raf = 0, ignited = false, flamed = false, exiting = false, exitAt = 0;
    const logoBox = () => logoRef.current?.getBoundingClientRect();
    const boxRect = () => boxRef.current.getBoundingClientRect();

    const tick = (now) => {
      const el = now - t0;
      // 1) chispa que cae → encendido
      if (!ignited && el >= T.spark) {
        ignited = true;
        setPhase('lit');
        const b = boxRect();
        embers.burst(b.width / 2, b.height * 0.86, mobile ? 40 : 70, 7, Math.PI * 1.1);
      }
      // 2) nivel del fuego
      const heat = Math.min(1, Math.max(0, (el - T.spark) / 1600));
      let lv = 0.35 + heat * 0.45;
      if (exiting) lv = 1;
      fire.set(lv);
      embers.set(0.2 + heat * 0.9 + (exiting ? 0.6 : 0));
      // 3) antorcha que escribe el logo dejando chispas
      const w = (el - T.write0) / T.writeLen;
      if (w > 0 && w < 1.02 && logoRef.current) {
        const r = logoBox(), b = boxRect();
        const k = easeIO(Math.min(1, w));
        const x = r.left - b.left + r.width * 0.02 + r.width * 0.95 * k;
        const y = r.top - b.top + r.height * (0.28 + Math.sin(k * 18) * 0.12);
        if (torchRef.current) torchRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (Math.random() < 0.9) embers.burst(x, y, mobile ? 2 : 4, 2.6, Math.PI * 1.4);
      }
      // 4) explosión de chispas al encender la llama de la "i"
      if (!flamed && el >= T.flame && logoRef.current) {
        flamed = true;
        const r = logoBox(), b = boxRect();
        embers.burst(r.left - b.left + r.width * (418 / 610), r.top - b.top + r.height * (70 / 400), mobile ? 30 : 55, 5);
      }
      // 5) termómetro
      const temp = Math.round(400 * easeIO(Math.min(1, Math.max(0, (el - 400) / (T.exit - 900)))));
      if (tempRef.current) tempRef.current.textContent = `${temp}°C`;
      if (exiting && now - exitAt > T.surge + T.burn + 200) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // salida: el fuego crece y "quema" la pantalla desde abajo
    const burn = () => {
      const c = burnRef.current;
      const W = mobile ? 160 : 224, H = mobile ? 90 : 126;
      const field = noiseField(W, H);
      const off = document.createElement('canvas'); off.width = W; off.height = H;
      const octx = off.getContext('2d');
      const img = octx.createImageData(W, H);
      const ctx = c.getContext('2d');
      c.width = window.innerWidth; c.height = window.innerHeight;
      const b0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - b0) / T.burn);
        const th = 0.05 + easeIO(k) * 1.15;
        const d = img.data;
        for (let i = 0; i < W * H; i++) {
          const v = field[i], o = i * 4;
          if (v < th - 0.08) { d[o + 3] = 0; continue; }
          if (v < th) {
            const e = (v - (th - 0.08)) / 0.08;
            d[o] = 255; d[o + 1] = 70 + 110 * (1 - e); d[o + 2] = 20 * (1 - e); d[o + 3] = 255 * (0.3 + e * 0.7);
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
      if (reduce) { setPhase('exit'); unlock(); onReveal(); timers.push(setTimeout(onDone, 200)); return; }
      exiting = true; exitAt = performance.now();
      setPhase('surge'); // el fuego sube y cubre la pantalla
      const b = boxRect();
      embers.burst(b.width / 2, b.height, mobile ? 60 : 110, 9, Math.PI * 0.9);
      timers.push(setTimeout(() => {
        setPhase('exit');
        unlock();
        onReveal();
        burn();
        timers.push(setTimeout(() => { embers.stop(); fire.stop(); onDone(); }, T.burn + 80));
      }, T.surge));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 800 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); embers.stop(); fire.stop(); unlock(); };
  }, [onReveal, onDone]);

  const tag = t.loader.tag;
  return (
    <div ref={boxRef} className={`qp-loader ph-${phase}`} role="status" aria-label="Quile Parrilla">
      <div className="ld-flash" aria-hidden="true" />
      <div className="ld-fire" aria-hidden="true"><canvas ref={fireRef} /></div>
      <canvas ref={embersRef} className="ld-embers" aria-hidden="true" />
      <span className="ld-spark" aria-hidden="true" />
      <div className="ld-center">
        <div ref={logoRef} className="ld-logo"><QuileLogo /></div>
        <p className="ld-tag font-script" aria-label={tag}>
          {tag.split('').map((ch, i) => <span key={i} style={{ '--i': i }} aria-hidden="true">{ch === ' ' ? '\u00A0' : ch}</span>)}
        </p>
        <div className="ld-temp">
          <span>{t.loader.heat}</span>
          <i className="ld-thermo" aria-hidden="true"><em /></i>
          <b ref={tempRef}>0°C</b>
        </div>
      </div>
      <span ref={torchRef} className="ld-torch" aria-hidden="true" />
      <canvas ref={burnRef} className="ld-burn" aria-hidden="true" />
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
