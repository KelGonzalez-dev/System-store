// ============================================================
// Brasas: chispas que suben con turbulencia, dibujadas en un canvas.
// Usa un "sprite" pre-renderizado (sin sombras en tiempo real) → muy liviano.
// ============================================================
export function createEmbers(canvas, { count = 90, intensity = 1 } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let W = 0, H = 0, raf = 0, running = false, last = 0, level = intensity;

  // brillo pre-renderizado
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const sc = sprite.getContext('2d');
  const g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,240,200,1)');
  g.addColorStop(0.18, 'rgba(255,190,90,0.95)');
  g.addColorStop(0.45, 'rgba(255,110,30,0.35)');
  g.addColorStop(1, 'rgba(255,80,0,0)');
  sc.fillStyle = g;
  sc.fillRect(0, 0, 64, 64);

  const resize = () => {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const spawn = (p, fresh) => {
    p.x = Math.random() * W;
    p.y = fresh ? Math.random() * H : H + 10 + Math.random() * 40;
    p.vy = -(0.4 + Math.random() * 1.3);
    p.vx = (Math.random() - 0.5) * 0.4;
    p.s = 2 + Math.random() * 7;
    p.life = 0; p.max = 220 + Math.random() * 320;
    p.ph = Math.random() * 6.28; p.f = 0.01 + Math.random() * 0.03;
    return p;
  };
  const parts = Array.from({ length: count }, () => spawn({}, true));

  const frame = (now) => {
    const dt = Math.min(3, (now - last) / 16.67 || 1); last = now;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      p.life += dt;
      p.ph += p.f * dt;
      p.x += (p.vx + Math.sin(p.ph) * 0.6) * dt;
      p.y += p.vy * dt * (0.6 + level * 0.6);
      const k = p.life / p.max;
      if (k >= 1 || p.y < -20) { spawn(p, false); continue; }
      const a = Math.sin(Math.PI * k) * (0.35 + 0.65 * level);
      const s = p.s * (1 - k * 0.5);
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, p.x - s * 2, p.y - s * 2, s * 4, s * 4);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if (running) raf = requestAnimationFrame(frame);
  };

  return {
    start() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    set(v) { level = v; },
    resize,
  };
}

// Apaga/enciende las brasas según si el canvas está en pantalla
export function autoPause(canvas, embers) {
  const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? embers.start() : embers.stop()));
  io.observe(canvas);
  const vis = () => (document.hidden ? embers.stop() : embers.start());
  document.addEventListener('visibilitychange', vis);
  const onR = () => embers.resize();
  window.addEventListener('resize', onR);
  return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); window.removeEventListener('resize', onR); embers.stop(); };
}
