// ============================================================
// La mascota de Feel Fresco recreada en SVG: gorra, gafas con
// rayos, melena y labios chiflando. Todo se anima con CSS
// (transform/opacity), así que es liviano en cualquier celular.
// ============================================================

const RED = '#E8323C';

// Sello ondulado (como una tapa de botella)
function scallop(cx, cy, R, amp, n, steps = 360) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = R + amp * Math.cos(n * a);
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  return `${d}Z`;
}
const SEAL = scallop(120, 120, 112, 4.5, 26);

// Nota musical (corchea) y doble corchea
function Note({ kind = 1 }) {
  return kind === 1 ? (
    <g>
      <ellipse cx="0" cy="0" rx="6" ry="4.6" transform="rotate(-22)" fill={RED} />
      <path d="M5 -1.5V-24c4 2 9 4 9 11" fill="none" stroke={RED} strokeWidth="2.6" strokeLinecap="round" />
    </g>
  ) : (
    <g>
      <ellipse cx="0" cy="0" rx="5.5" ry="4.2" transform="rotate(-22)" fill={RED} />
      <ellipse cx="15" cy="-4" rx="5.5" ry="4.2" transform="rotate(-22 15 -4)" fill={RED} />
      <path d="M4.6 -1.5V-24L19.6 -28V-5.5" fill="none" stroke={RED} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M4.6 -24L19.6 -28" stroke={RED} strokeWidth="5" />
    </g>
  );
}

// Dibujo de la mascota (coordenadas 0–200)
export function MascotArt({ notes = true }) {
  const s = { fill: 'none', stroke: RED, strokeWidth: 3.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <g className="mascot">
      <defs>
        <clipPath id="lenses"><rect x="82" y="106" width="28" height="22" rx="3" /><rect x="116" y="106" width="28" height="22" rx="3" /></clipPath>
      </defs>
      {notes && (
        <g className="m-notes">
          {[1, 2, 1, 2, 1].map((k, i) => (
            <g key={i} transform="translate(134 146)">
              <g className="m-note" style={{ animationDelay: `${i * 0.48}s` }}><Note kind={k} /></g>
            </g>
          ))}
        </g>
      )}
      <g className="m-head">
        {/* melena detrás */}
        <g className="m-hair" {...s}>
          <path d="M66 100C58 118 66 128 58 144C54 152 60 160 54 170" />
          <path d="M74 106C68 122 76 132 68 150C64 158 70 166 66 176" />
          <path d="M60 96C50 110 56 122 48 134" />
        </g>
        <g className="m-hair m-hair-r" {...s}>
          <path d="M146 112C152 126 146 136 152 148C156 156 150 162 154 170" />
          <path d="M140 120C144 132 140 142 144 154" />
        </g>
        {/* cara */}
        <path d="M76 98C74 126 80 150 98 164C110 172 128 170 138 158C146 148 148 132 146 112L146 98Z" {...s} fill="#FFF1E6" />
        <path d="M78 122C70 118 66 128 72 134C74 136 77 136 79 134" {...s} fill="#FFF1E6" />
        {/* cejas (se asoman bajo la gorra) */}
        <g className="m-brows" {...s} strokeWidth="3"><path d="M88 103q8-4 16 0" /><path d="M120 103q8-4 16 0" /></g>
        {/* gorra */}
        <g className="m-cap">
          <path d="M66 102C62 64 90 42 118 44C144 46 160 66 154 100C126 94 96 94 66 102Z" {...s} fill="#FFD9EC" />
          <path d="M110 46C104 60 102 80 104 96" {...s} strokeWidth="2.6" />
          <path d="M74 98C56 92 42 96 36 108C50 112 64 110 80 104Z" {...s} fill="#F472B6" />
          <circle cx="116" cy="45" r="3.4" fill={RED} />
          <circle cx="132" cy="66" r="1.8" fill={RED} /><circle cx="141" cy="74" r="1.8" fill={RED} />
        </g>
        {/* gafas con rayos */}
        <g className="m-glasses">
          <rect x="82" y="106" width="28" height="22" rx="3" {...s} style={{ fill: RED }} />
          <rect x="116" y="106" width="28" height="22" rx="3" style={{ fill: RED }} {...s} />
          <path d="M110 114h6M82 112l-8-2" {...s} />
          <path d="M99 110l-6 6h6l-6 7M133 110l-6 6h6l-6 7" fill="none" stroke="#FFF1E6" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <g clipPath="url(#lenses)"><path className="m-glint" d="M70 130L84 104H92L78 130Z" fill="#fff" opacity=".55" /></g>
        </g>
        {/* nariz, mejilla inflada y labios chiflando */}
        <path d="M134 128C140 132 140 138 132 140" {...s} />
        <path className="m-cheek" d="M112 142C116 146 116 152 112 156" {...s} />
        <ellipse className="m-lips" cx="129" cy="150" rx="4.6" ry="5.2" {...s} fill="#F472B6" strokeWidth="3" />
        {/* cuello */}
        <path d="M100 164L98 186M124 166L126 186" {...s} />
      </g>
    </g>
  );
}

// Sello completo: borde ondulado, textos en arco y la mascota chiflando
export function Badge({ className = '', spin = false, notes = true, label = 'Feel Fresco' }) {
  return (
    <svg viewBox="0 0 240 240" className={`badge ${spin ? 'badge-spin' : ''} ${className}`} role="img" aria-label={label}>
      <defs>
        <path id="arcTop" d="M36 120A84 84 0 0 1 204 120" />
        <path id="arcBot" d="M22 120A98 98 0 0 0 218 120" />
      </defs>
      <path d={SEAL} fill="#F7A1D0" stroke={RED} strokeWidth="3" />
      <circle cx="120" cy="120" r="101" fill="none" stroke="#FFF1E6" strokeWidth="2" strokeDasharray="2 5" opacity=".9" />
      <g className="badge-text" fill={RED}>
        <text><textPath href="#arcTop" startOffset="50%" textAnchor="middle">DON’T STRESS</textPath></text>
        <text><textPath href="#arcBot" startOffset="50%" textAnchor="middle">FEEL FRESCO</textPath></text>
      </g>
      <g transform="translate(38 24) scale(0.85)"><MascotArt notes={notes} /></g>
    </svg>
  );
}

// Mascota sola, grande (para el hero)
export function Mascot({ className = '' }) {
  return (
    <svg viewBox="20 20 190 180" className={`overflow-visible ${className}`} aria-hidden="true"><MascotArt /></svg>
  );
}
