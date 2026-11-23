import { useState } from 'react';

const PUNTOS = [
  { n: 'Azul', t: 46, centro: '#8E1530', gris: 0.04, txt: 'Sellado por fuera, frío y rojo intenso por dentro.' },
  { n: 'Rojo', t: 52, centro: '#C0283A', gris: 0.08, txt: 'Centro rojo y tibio, muy jugoso.' },
  { n: 'Término medio', t: 57, centro: '#DA5A63', gris: 0.13, txt: 'Centro rosado y caliente. El punto que recomienda el chef.' },
  { n: 'Tres cuartos', t: 63, centro: '#C98A7E', gris: 0.22, txt: 'Apenas un toque rosado en el centro.' },
  { n: 'Bien asado', t: 71, centro: '#8E6E5E', gris: 0.36, txt: 'Cocido por completo, sin rosado.' },
];

/** Punto de cocción: desliza y mira cómo cambia el corte por dentro (y a qué temperatura). */
export default function Punto() {
  const [i, setI] = useState(2);
  const p = PUNTOS[i];
  return (
    <section className="punto">
      <div className="wrap punto__grid">
        <div className="rv">
          <p className="eyebrow">Punto de cocción</p>
          <h2 className="titulo">¿Cómo lo <em>quieres?</em></h2>
          <p className="sec-lead">Desliza y mira tu corte por dentro. Te lo servimos exactamente así.</p>
          <div className="punto__ctrl">
            <input type="range" min="0" max="4" step="1" value={i} onChange={(e) => setI(Number(e.target.value))} aria-label="Punto de cocción" style={{ '--p': `${i * 25}%` }} />
            <div className="punto__marcas">{PUNTOS.map((q, k) => <button key={q.n} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)}>{q.n}</button>)}</div>
          </div>
        </div>
        <div className="corte3d" style={{ '--centro': p.centro, '--gris': p.gris }}>
          <svg viewBox="0 0 520 300" aria-hidden="true">
            <defs>
              <linearGradient id="interior" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3A1508" />
                <stop offset="0.05" stopColor="#6B3A26" />
                <stop offset={0.06 + p.gris} stopColor="#9C7A6A" />
                <stop offset={0.12 + p.gris} stopColor={p.centro} />
                <stop offset={0.88 - p.gris} stopColor={p.centro} />
                <stop offset={0.94 - p.gris} stopColor="#9C7A6A" />
                <stop offset="0.95" stopColor="#6B3A26" />
                <stop offset="1" stopColor="#3A1508" />
              </linearGradient>
              <linearGradient id="lados" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3A1508" /><stop offset={0.03 + p.gris / 3} stopColor="#9C7A6A" stopOpacity=".9" /><stop offset={0.08 + p.gris / 2} stopColor={p.centro} stopOpacity="0" />
                <stop offset={0.92 - p.gris / 2} stopColor={p.centro} stopOpacity="0" /><stop offset={0.97 - p.gris / 3} stopColor="#9C7A6A" stopOpacity=".9" /><stop offset="1" stopColor="#3A1508" />
              </linearGradient>
            </defs>
            <rect x="30" y="60" width="460" height="190" rx="34" fill="url(#interior)" />
            <rect x="30" y="60" width="460" height="190" rx="34" fill="url(#lados)" />
            <rect x="30" y="60" width="460" height="190" rx="34" fill="none" stroke="#2A0F06" strokeWidth="6" />
            {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${80 + k * 70} 60l-14 0`} stroke="#120502" strokeWidth="10" strokeLinecap="round" />)}
            {[0, 1, 2, 3, 4, 5].map((k) => <path key={`b${k}`} d={`M${86 + k * 70} 250l-14 0`} stroke="#120502" strokeWidth="10" strokeLinecap="round" />)}
            {[[120, 120, 200, 110], [260, 200, 360, 215], [330, 110, 420, 130]].map(([x1, y1, x2, y2], k) => <path key={`m${k}`} d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${y1 - 14} ${x2} ${y2}`} stroke="#F2D9C4" strokeWidth="3" fill="none" opacity=".35" />)}
            <ellipse cx="200" cy="130" rx="120" ry="20" fill="#fff" opacity=".06" />
          </svg>
          <div className="corte3d__info" key={p.n}>
            <b>{p.t}°C</b>
            <span>{p.n}</span>
            <p>{p.txt}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
