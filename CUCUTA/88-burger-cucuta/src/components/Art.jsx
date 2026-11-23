// Ilustraciones de los platos (SVG propio). Se usan como respaldo si una foto no carga
// y como íconos de las categorías del menú.
export default function Art({ tipo = 'burger', className = '' }) {
  const d = {
    burger: (
      <g>
        <path d="M30 92c0-34 32-56 70-56s70 22 70 56z" fill="#E9A23B" />
        <path d="M44 74c10-18 30-28 56-28" stroke="#F6C46A" strokeWidth="6" strokeLinecap="round" fill="none" opacity=".7" />
        {[[70, 60], [95, 52], [120, 58], [82, 72], [110, 70], [140, 72], [58, 78]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="2.4" fill="#FFF2D6" transform={`rotate(${i * 25} ${x} ${y})`} />)}
        <path d="M26 98c12-6 20 6 32 0s20 6 32 0 20 6 32 0 20 6 32 0 14 4 20 0v8H26z" fill="#4CB050" />
        <path d="M24 104h152l-14 18H38z" fill="#FFC531" />
        <path d="M60 122l6 12 6-12M118 122l6 14 6-14" fill="#FFC531" />
        <rect x="28" y="110" width="144" height="22" rx="11" fill="#5B2E1C" />
        <path d="M40 116h120" stroke="#7A4129" strokeWidth="3" strokeDasharray="4 7" />
        <path d="M34 138h132c0 14-14 24-32 24H66c-18 0-32-10-32-24z" fill="#D9892F" />
      </g>
    ),
    hotdog: (
      <g transform="rotate(-12 100 100)">
        <rect x="20" y="88" width="160" height="40" rx="20" fill="#D9892F" />
        <rect x="14" y="80" width="172" height="26" rx="13" fill="#B4432B" />
        <path d="M30 86c12-8 22 8 34 0s22 8 34 0 22 8 34 0 22 8 34 0" stroke="#FFC531" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M34 98c12-6 22 6 34 0s22 6 34 0 22 6 34 0" stroke="#E1262B" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="24" y="104" width="152" height="22" rx="11" fill="#E9A23B" />
      </g>
    ),
    fries: (
      <g>
        {[[62, 40, -8], [80, 30, -3], [98, 26, 2], [116, 32, 6], [134, 42, 10], [72, 50, -5], [124, 50, 7]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width="13" height="78" rx="4" fill={i % 2 ? '#FFD45E' : '#FFC531'} transform={`rotate(${r} ${x} ${y + 70})`} />)}
        <path d="M48 90h104l-12 78H60z" fill="#E1262B" />
        <path d="M48 90h104" stroke="#B51A1F" strokeWidth="6" />
        <text x="100" y="140" textAnchor="middle" fontFamily="Bowlby One, sans-serif" fontSize="26" fill="#FFF4E0">88</text>
      </g>
    ),
    salchipapa: (
      <g>
        <ellipse cx="100" cy="140" rx="78" ry="26" fill="#E1262B" />
        <ellipse cx="100" cy="128" rx="74" ry="24" fill="#2B2420" />
        {[...Array(16)].map((_, i) => <rect key={i} x={40 + (i * 9) % 110} y={96 + (i * 7) % 24} width="10" height="40" rx="3" fill="#FFC531" transform={`rotate(${(i * 37) % 80 - 40} ${45 + (i * 9) % 110} ${116})`} />)}
        {[[70, 112], [104, 104], [132, 118], [88, 124]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="8" fill="#B4432B" />)}
        <path d="M50 108c14-10 26 6 40-4s26 8 40-2 18 4 24 0" stroke="#FFE07A" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    ),
    picada: (
      <g>
        <ellipse cx="100" cy="132" rx="86" ry="34" fill="#6B3E21" />
        <ellipse cx="100" cy="124" rx="80" ry="30" fill="#8A5530" />
        <ellipse cx="72" cy="114" rx="22" ry="12" fill="#5B2E1C" />
        <ellipse cx="124" cy="110" rx="20" ry="11" fill="#7A3B22" />
        <rect x="88" y="120" width="34" height="14" rx="7" fill="#B4432B" />
        {[[52, 128], [60, 136], [140, 130], [148, 122], [132, 138]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#F2C14E" />)}
        <path d="M70 140l20-8M104 140l26-6" stroke="#FFC531" strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
    shake: (
      <g>
        <path d="M66 70h68l-10 100H76z" fill="#FFF4E0" opacity=".9" />
        <path d="M70 100h60l-7 70H77z" fill="#F4A9B8" />
        <path d="M60 70c0-18 18-28 40-28s40 10 40 28z" fill="#FFFFFF" />
        <circle cx="100" cy="38" r="9" fill="#E1262B" />
        <rect x="112" y="16" width="7" height="70" rx="3" fill="#E1262B" transform="rotate(14 116 50)" />
      </g>
    ),
    drink: (
      <g>
        <path d="M70 56h60l-8 116H78z" fill="#FFF4E0" opacity=".25" stroke="#FFF4E0" strokeWidth="3" />
        <path d="M74 86h52l-6 84H80z" fill="#FFC531" opacity=".85" />
        {[[90, 110], [108, 130], [96, 150]].map(([x, y], i) => <rect key={i} x={x} y={y} width="14" height="14" rx="3" fill="#FFFFFF" opacity=".6" />)}
        <rect x="104" y="30" width="6" height="70" rx="3" fill="#E1262B" transform="rotate(12 107 60)" />
      </g>
    ),
  }[tipo] || null;
  return (
    <svg viewBox="0 0 200 200" className={`art ${className}`} aria-hidden="true">
      <ellipse cx="100" cy="176" rx="70" ry="8" fill="rgba(0,0,0,.35)" />
      {d}
    </svg>
  );
}
