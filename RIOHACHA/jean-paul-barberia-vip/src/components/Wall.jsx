import { useEffect, useRef, useState } from 'react';
import { CONFIG, WALL } from '../data';
import { lockScroll, reducedMotion } from '../lib/scroll';

const COLS = 5, ROWS = 4;

/**
 * Galería "mesa de luz": un muro infinito de fotos que se arrastra en cualquier dirección (con inercia).
 * Las fotos cerca del centro crecen y las de los bordes se alejan, como una lupa. Toca una para verla grande.
 * Sin arrastre, el muro se desliza solo y despacio.
 */
export default function Wall() {
  const stage = useRef(null);
  const tiles = useRef([]);
  const [view, setView] = useState(null);
  useEffect(() => {
    const el = stage.current;
    let ox = 0, oy = 0, vx = -0.35, vy = -0.18, drag = null, raf = 0, visible = false, moved = 0;
    const reduce = reducedMotion();
    const frame = () => {
      if (!drag && !reduce) { ox += vx; oy += vy; vx += (-0.35 - vx) * 0.02; vy += (-0.18 - vy) * 0.02; }
      const W = el.clientWidth, H = el.clientHeight;
      const tw = Math.max(170, Math.min(300, W / 4.2)), th = tw * 1.25, gap = tw * 0.08;
      const cw = tw + gap, ch = th + gap, totalW = cw * COLS, totalH = ch * ROWS;
      const cx = W / 2, cy = H / 2;
      tiles.current.forEach((t, i) => {
        if (!t) return;
        const c = i % COLS, r = Math.floor(i / COLS);
        let x = ((c * cw + ox) % totalW + totalW) % totalW - totalW / 2 + cx - tw / 2 + (r % 2 ? cw / 2 : 0);
        let y = ((r * ch + oy) % totalH + totalH) % totalH - totalH / 2 + cy - th / 2;
        if (x > W + tw) x -= totalW; if (x < -tw * 2) x += totalW;
        const dx = (x + tw / 2 - cx) / W, dy = (y + th / 2 - cy) / H;
        const d = Math.min(1, Math.hypot(dx, dy) * 1.5);
        const s = 1.12 - d * 0.38;
        t.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        t.style.opacity = (1 - d * 0.55).toFixed(3);
      });
      if (visible) raf = requestAnimationFrame(frame);
    };
    const down = (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; el.setPointerCapture?.(e.pointerId); el.classList.add('grab'); };
    const move = (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY }; ox += dx; oy += dy; vx = dx; vy = dy; moved += Math.abs(dx) + Math.abs(dy); };
    const up = () => { drag = null; el.classList.remove('grab'); };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    el.dataset.moved = '0';
    el.addEventListener('click', (e) => { if (moved > 8) { e.stopPropagation(); e.preventDefault(); } }, true);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(frame); });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);
  useEffect(() => {
    if (!view) return undefined;
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && setView(null);
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [view]);
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => WALL[(i * 3 + Math.floor(i / COLS)) % WALL.length]);
  return (
    <section id="galeria" className="wall-sec">
      <div className="wrap wall-head">
        <div>
          <p className="eyebrow"><span className="dot" /> Galería</p>
          <h2 className="rv mask-up sec-title"><span>Arrastra y <em>explora</em></span></h2>
        </div>
        <a className="btn btn-line" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a>
      </div>
      <div ref={stage} className="wall" aria-label="Galería de fotos: arrastra para explorar">
        {cells.map((src, i) => (
          <button key={i} type="button" ref={(el) => { tiles.current[i] = el; }} className="wt" onClick={() => setView(src)} aria-label="Ver foto">
            <img src={src} alt="" loading="lazy" draggable="false" />
          </button>
        ))}
        <span className="wall-hint" aria-hidden="true">✥ Arrastra</span>
      </div>
      {view && (
        <div className="viewer" role="dialog" aria-modal="true" onClick={() => setView(null)}>
          <img src={view} alt="" />
          <button type="button" className="vw-close" aria-label="Cerrar">✕</button>
        </div>
      )}
    </section>
  );
}
