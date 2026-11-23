import { useRef, useState } from 'react';
import { useScrollFrame, clamp } from '../lib/scroll';

// Capas de la hamburguesa (de arriba hacia abajo). Cada capa es un dibujo en 2.5D (con volumen).
const CAPAS = [
  { id: 'pan', nombre: 'Pan brioche', txt: 'Suave, dorado y con ajonjolí. Horneado para aguantar todo el queso.', h: 120, svg: (
    <g>
      <path d="M20 96c0-48 58-80 130-80s130 32 130 80c0 10-58 20-130 20S20 106 20 96z" fill="#E59A35" />
      <path d="M44 70c18-28 56-42 106-42" stroke="#FBC774" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".7" />
      {[[90, 52], [130, 40], [170, 44], [210, 54], [110, 74], [150, 66], [190, 70], [235, 76], [70, 80]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="3.5" fill="#FFF3DA" transform={`rotate(${i * 31} ${x} ${y})`} />)}
    </g>
  ) },
  { id: 'salsa', nombre: 'Salsa 88', txt: 'La receta secreta de la casa. No preguntes, solo pruébala.', h: 46, svg: (
    <g><ellipse cx="150" cy="24" rx="122" ry="16" fill="#F28C28" /><path d="M60 30c4 10 10 10 12 0M150 36c4 12 12 12 14 0M222 30c3 8 9 8 10 0" stroke="#F28C28" strokeWidth="8" strokeLinecap="round" /></g>
  ) },
  { id: 'lechuga', nombre: 'Lechuga crespa', txt: 'Fresca y crocante, lavada el mismo día.', h: 50, svg: (
    <path d="M18 26c16-14 24 10 40-2s22 12 40-2 22 12 40 0 22 12 40-2 22 12 40-2 18 10 38 0v14c-20 8-28-6-40 6s-26-6-40 6-26-6-40 6-26-6-40 6-26-6-40 4-24-4-38 2z" fill="#5DBB55" />
  ) },
  { id: 'tomate', nombre: 'Tomate', txt: 'En rodajas, maduro y jugoso.', h: 44, svg: (
    <g>{[90, 210].map((x) => <g key={x}><ellipse cx={x} cy="22" rx="62" ry="16" fill="#E2362F" /><ellipse cx={x} cy="20" rx="48" ry="11" fill="#F45A4D" />{[-20, 0, 20].map((d) => <ellipse key={d} cx={x + d} cy="20" rx="5" ry="3" fill="#FFD2A6" />)}</g>)}</g>
  ) },
  { id: 'queso', nombre: 'Queso cheddar fundido', txt: 'Doble lámina que se derrite sobre la carne caliente.', h: 70, svg: (
    <g>
      <path d="M14 14h272l-26 28H40z" fill="#FFC531" />
      <path d="M40 42c0 18 10 18 12 0M96 42c0 26 12 26 14 0M168 42c0 14 9 14 10 0M226 42c0 22 11 22 12 0" stroke="#FFC531" strokeWidth="14" strokeLinecap="round" />
      <path d="M30 18h236" stroke="#FFE07A" strokeWidth="5" strokeLinecap="round" />
    </g>
  ) },
  { id: 'tocineta', nombre: 'Tocineta crocante', txt: 'Ahumada y dorada al punto exacto.', h: 50, svg: (
    <g>{[0, 1].map((k) => <path key={k} d={`M${20 + k * 30} ${18 + k * 14}c30-18 50 14 80-4s50 14 80-4 50 14 80-4v10c-30 18-50-14-80 4s-50-14-80 4-50-14-80 4z`} fill={k ? '#A83A24' : '#C14B2E'} />)}</g>
  ) },
  { id: 'carne', nombre: 'Carne 100 % res', txt: '150 g de carne de res sellada en la plancha a 188 °C.', h: 84, svg: (
    <g>
      <rect x="24" y="14" width="252" height="56" rx="28" fill="#4A2416" />
      <rect x="24" y="14" width="252" height="26" rx="13" fill="#5E2F1C" />
      {[60, 100, 140, 180, 220].map((x) => <path key={x} d={`M${x} 22l14 10`} stroke="#3A1A0F" strokeWidth="5" strokeLinecap="round" />)}
    </g>
  ) },
  { id: 'base', nombre: 'Base de brioche', txt: 'Tostada por dentro para que nada se humedezca.', h: 70, svg: (
    <g><path d="M24 14h252c0 30-30 48-70 48H94C54 62 24 44 24 14z" fill="#D88A2D" /><rect x="24" y="8" width="252" height="14" rx="7" fill="#E8A54A" /></g>
  ) },
];

/**
 * "Anatomía de una 88" (sección fija): al bajar, la hamburguesa se separa capa por capa en el aire,
 * cada ingrediente muestra su nombre, y al final vuelve a armarse.
 */
export default function Anatomia() {
  const sec = useRef(null);
  const capas = useRef([]);
  const etiquetas = useRef([]);
  const [activa, setActiva] = useState(-1);
  const act = useRef(-1);
  useScrollFrame(sec, (p) => {
    // 0 → 0.15 armada · 0.15 → 0.45 se separa · 0.45 → 0.85 separada (recorre ingredientes) · 0.85 → 1 se vuelve a armar
    const sep = p < 0.15 ? 0 : p < 0.45 ? (p - 0.15) / 0.3 : p < 0.85 ? 1 : 1 - (p - 0.85) / 0.15;
    const e = sep < 0.5 ? 2 * sep * sep : 1 - Math.pow(-2 * sep + 2, 2) / 2;
    const n = CAPAS.length;
    const gap = window.innerWidth < 980 ? Math.min(window.innerHeight * 0.032, 28) : Math.min(window.innerHeight * 0.075, 64);
    capas.current.forEach((el, i) => {
      if (!el) return;
      const off = (i - (n - 1) / 2) * gap * e;
      const rot = (i % 2 ? 1 : -1) * 6 * e;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    });
    etiquetas.current.forEach((el) => { if (el) el.style.opacity = clamp((e - 0.6) / 0.4).toFixed(3); });
    const k = p >= 0.45 && p < 0.85 ? Math.min(n - 1, Math.floor(((p - 0.45) / 0.4) * n)) : -1;
    if (k !== act.current) { act.current = k; setActiva(k); }
    sec.current?.style.setProperty('--e', e.toFixed(3));
  }, 'pin');

  return (
    <section id="anatomia" ref={sec} className="ana">
      <div className="ana__sticky">
        <div className="wrap ana__grid">
          <div className="ana__copy">
            <p className="eyebrow">Anatomía de una 88</p>
            <h2 className="titulo">Cada capa <span className="queso">cuenta.</span></h2>
            <p className="ana__lead">Así se arma una hamburguesa que no es una más. Sigue bajando y mírala por dentro.</p>
            <div className="ana__actual" aria-live="polite">
              {activa >= 0 ? (<><b key={activa}>{CAPAS[activa].nombre}</b><p>{CAPAS[activa].txt}</p></>) : <p className="ana__pista">↓ Baja para desarmarla</p>}
            </div>
          </div>
          <div className="ana__stage" aria-hidden="true">
            <span className="ana__sombra" />
            <div className="ana__pila">
              {CAPAS.map((c, i) => (
                <div key={c.id} ref={(el) => { capas.current[i] = el; }} className={`ana__capa${activa === i ? ' on' : ''}`} style={{ '--h': `${c.h}px` }}>
                  <svg viewBox={`0 0 300 ${c.h}`} preserveAspectRatio="xMidYMid meet">{c.svg}</svg>
                  <span ref={(el) => { etiquetas.current[i] = el; }} className={`ana__tag ${i % 2 ? 'izq' : 'der'}`}><i />{c.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
