// Ilustraciones de respaldo (si una foto no carga) en el estilo de la casa.
export default function Art({ tipo = 'steak' }) {
  const d = {
    steak: (
      <g>
        <path d="M40 104c0-36 34-60 74-58 38 2 52 22 50 44-2 30-34 52-74 52-32 0-50-14-50-38z" fill="#5A2412" />
        <path d="M50 102c0-30 28-50 64-48 32 2 44 18 42 36-2 26-28 44-62 44-28 0-44-12-44-32z" fill="#7A3018" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${66 + i * 22} 66l-18 64`} stroke="#2A0F07" strokeWidth="6" strokeLinecap="round" opacity=".8" />)}
        <path d="M150 72c10 8 14 22 10 36" stroke="#F3E3C8" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M120 40c4-10 14-14 22-10" stroke="#3E7D2A" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    ),
    burger: (
      <g>
        <path d="M44 92c0-30 26-48 56-48s56 18 56 48z" fill="#C9822F" />
        <path d="M40 98h120v8H40z" fill="#4E9A3A" /><path d="M40 106h120l-10 12H50z" fill="#F2B632" />
        <rect x="42" y="114" width="116" height="20" rx="10" fill="#4A1E10" />
        <path d="M46 140h108c0 12-12 20-28 20H74c-16 0-28-8-28-20z" fill="#B87228" />
      </g>
    ),
    plato: (
      <g>
        <ellipse cx="100" cy="112" rx="78" ry="34" fill="#E9E1D4" /><ellipse cx="100" cy="108" rx="60" ry="24" fill="#F7F1E7" />
        <ellipse cx="88" cy="102" rx="26" ry="12" fill="#8A3A1A" /><ellipse cx="118" cy="104" rx="16" ry="9" fill="#E3A72F" />
        <path d="M70 116c10-6 20 2 30-4" stroke="#4E9A3A" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    ),
    postre: (
      <g>
        <ellipse cx="100" cy="132" rx="70" ry="22" fill="#E9E1D4" />
        {[0, 1, 2].map((i) => <ellipse key={i} cx="100" cy={118 - i * 14} rx="48" ry="14" fill={i % 2 ? '#E0A15A' : '#C98444'} />)}
        {[[82, 82], [100, 76], [118, 82], [94, 90], [110, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill={i % 2 ? '#3B2A6B' : '#B3122A'} />)}
      </g>
    ),
    cerveza: (
      <g>
        <path d="M66 50h64l-6 112H72z" fill="#F2B632" /><path d="M64 44h68v18H64z" rx="8" fill="#FFF6DF" />
        <circle cx="74" cy="44" r="10" fill="#FFF6DF" /><circle cx="96" cy="40" r="12" fill="#FFF6DF" /><circle cx="120" cy="44" r="10" fill="#FFF6DF" />
        <path d="M130 72h14c8 0 12 6 12 14v20c0 8-4 14-12 14h-16" stroke="#E9E1D4" strokeWidth="8" fill="none" />
        {[[86, 110], [104, 90], [96, 136], [112, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#FFF6DF" opacity=".7" />)}
      </g>
    ),
    coctel: (
      <g>
        <path d="M52 52h96l-48 56z" fill="#F07A3A" opacity=".85" /><path d="M52 52h96" stroke="#FFF6DF" strokeWidth="4" />
        <path d="M100 108v44M74 156h52" stroke="#E9E1D4" strokeWidth="6" strokeLinecap="round" />
        <circle cx="134" cy="54" r="14" fill="#9BCB3C" /><circle cx="134" cy="54" r="9" fill="#C8E07A" />
      </g>
    ),
  }[tipo];
  return (
    <svg viewBox="0 0 200 200" className="art" aria-hidden="true">
      <ellipse cx="100" cy="176" rx="66" ry="8" fill="rgba(0,0,0,.35)" />
      {d}
    </svg>
  );
}
