import { useId } from 'react';

// Ilustraciones de producto (SVG propio): se ven como "foto de catálogo" sobre fondo blanco.
// Se usan como imagen de ejemplo y como respaldo cuando un producto no tiene foto real.
export default function Art({ art, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const { k, c = '#999', t = '' } = art;
  const g = `g${uid}`, sh = `s${uid}`;
  const dark = 'rgba(0,0,0,.18)', light = 'rgba(255,255,255,.45)';
  let el;
  switch (k) {
    case 'saco': {
      const s = art.small ? 0.7 : 1;
      el = (
        <g transform={`translate(100 108) scale(${s}) translate(-100 -108)`}>
          <path d="M52 52c0-6 4-10 10-10h76c6 0 10 4 10 10l6 112c0 7-5 12-12 12H58c-7 0-12-5-12-12z" fill="#f4efe6" />
          <path d="M52 52c0-6 4-10 10-10h76c6 0 10 4 10 10l1 18H51z" fill={c} />
          <path d="M47 140h106l1 24c0 7-5 12-12 12H58c-7 0-12-5-12-12z" fill={c} />
          <rect x="62" y="82" width="76" height="44" rx="4" fill="#fff" stroke={c} strokeWidth="3" />
          <text x="100" y="104" textAnchor="middle" fontSize="13" fontWeight="800" fill={c} fontFamily="Archivo, sans-serif">{t}</text>
          <text x="100" y="119" textAnchor="middle" fontSize="9" fontWeight="700" fill="#555" fontFamily="Archivo, sans-serif">{art.small ? '2 kg' : '50 kg'}</text>
          <path d="M56 46l-4 118" stroke={light} strokeWidth="6" strokeLinecap="round" />
          <path d="M62 42c10 6 66 6 76 0" stroke={dark} strokeWidth="2" fill="none" />
        </g>
      );
      break;
    }
    case 'varilla':
      el = (<g>{[0, 1, 2, 3, 4, 5, 6].map((i) => <g key={i} transform={`translate(${24 + i * 4} ${60 + i * 12}) rotate(-14)`}><rect width="160" height="8" rx="4" fill={c} /><path d="M6 0v8M18 0v8M30 0v8M42 0v8M54 0v8M66 0v8M78 0v8M90 0v8M102 0v8M114 0v8M126 0v8M138 0v8M150 0v8" stroke={dark} strokeWidth="2" /></g>)}<rect x="80" y="70" width="10" height="90" rx="3" fill="#222" transform="rotate(-14 85 115)" /></g>);
      break;
    case 'bloque':
      el = art.brick
        ? (<g><path d="M40 90l60-24 60 24v44l-60 26-60-26z" fill={c} /><path d="M40 90l60 26 60-26" fill="none" stroke={dark} strokeWidth="2" /><path d="M100 116v44" stroke={dark} strokeWidth="2" /><path d="M40 90l60-24 60 24-60 26z" fill="#d9774f" /></g>)
        : (<g><path d="M30 92l70-30 70 30v52l-70 32-70-32z" fill={c} /><path d="M30 92l70-30 70 30-70 32z" fill="#bdbdbd" /><path d="M58 90l20-8 20 8-20 9zM102 90l20-8 20 8-20 9z" fill="#757575" /><path d="M100 124v52" stroke={dark} strokeWidth="2" /></g>);
      break;
    case 'arena':
      el = (<g><path d="M20 168c20-70 60-110 80-110s60 40 80 110z" fill={c} /><path d="M60 120c12-20 28-34 40-38" stroke={light} strokeWidth="8" strokeLinecap="round" fill="none" />{[...Array(18)].map((_, i) => <circle key={i} cx={40 + ((i * 37) % 120)} cy={110 + ((i * 23) % 50)} r="2.2" fill={dark} />)}</g>);
      break;
    case 'tubo':
      el = (<g transform="rotate(-18 100 110)"><rect x="18" y={art.big ? 88 : 96} width="164" height={art.big ? 44 : 28} rx="4" fill={c} stroke="#cfcfcf" /><ellipse cx="182" cy={art.big ? 110 : 110} rx="7" ry={art.big ? 22 : 14} fill="#bdbdbd" /><ellipse cx="182" cy="110" rx="4" ry={art.big ? 16 : 9} fill="#757575" /><rect x="30" y={art.big ? 94 : 100} width="140" height="5" rx="2" fill={light} /><text x="90" y={art.big ? 118 : 115} fontSize="9" fill="#9e9e9e" fontWeight="700" fontFamily="Archivo, sans-serif">PVC</text></g>);
      break;
    case 'codo':
      el = (<g><path d="M60 150V100c0-22 18-40 40-40h50v36h-50c-2 0-4 2-4 4v50z" fill={c} stroke="#cfcfcf" strokeWidth="2" /><rect x="52" y="140" width="52" height="20" rx="3" fill="#e0e0e0" /><rect x="140" y="52" width="20" height="52" rx="3" fill="#e0e0e0" /></g>);
      break;
    case 'cable':
      el = (<g><circle cx="100" cy="110" r="62" fill={c} /><circle cx="100" cy="110" r="62" fill="none" stroke={dark} strokeWidth="2" />{[50, 42, 34, 26].map((r) => <circle key={r} cx="100" cy="110" r={r} fill="none" stroke={dark} strokeWidth="1.5" />)}<circle cx="100" cy="110" r="18" fill="#f5f5f5" /><path d="M150 140c18 14 26 24 30 34" stroke={c} strokeWidth="8" strokeLinecap="round" fill="none" /></g>);
      break;
    case 'malla':
      el = (<g transform="skewX(-12)"><rect x="50" y="50" width="120" height="120" fill="none" stroke={c} strokeWidth="4" />{[70, 90, 110, 130, 150].map((v) => <g key={v}><path d={`M${v} 50v120`} stroke={c} strokeWidth="3" /><path d={`M50 ${v}h120`} stroke={c} strokeWidth="3" /></g>)}</g>);
      break;
    case 'clavos':
      el = (<g><path d="M50 80h100v80c0 6-4 10-10 10H60c-6 0-10-4-10-10z" fill="#cfd8dc" /><path d="M50 80h100l-10-16H60z" fill="#b0bec5" />{[64, 82, 100, 118, 136].map((x, i) => <g key={x} transform={`rotate(${i * 6 - 12} ${x} 72)`}><rect x={x - 2} y="40" width="4" height="40" fill={c} /><rect x={x - 6} y="38" width="12" height="4" rx="2" fill="#757575" /></g>)}<rect x="62" y="104" width="76" height="30" rx="3" fill="#fff" /><text x="100" y="124" textAnchor="middle" fontSize="12" fontWeight="800" fill="#455a64" fontFamily="Archivo, sans-serif">1 kg</text></g>);
      break;
    case 'toma':
      el = (<g><rect x="56" y="40" width="88" height="136" rx="12" fill={c} stroke="#e0e0e0" strokeWidth="2" />{art.br ? (<g><rect x="80" y="70" width="40" height="56" rx="4" fill="#424242" /><rect x="92" y="84" width="16" height="22" rx="2" fill="#ff5252" /><text x="100" y="150" textAnchor="middle" fontSize="12" fill="#bdbdbd" fontWeight="800">20A</text></g>) : art.sw ? (<rect x="86" y="80" width="28" height="56" rx="4" fill="#eeeeee" stroke="#bdbdbd" />) : (<g>{[78, 124].map((y) => <g key={y}><rect x="84" y={y - 14} width="5" height="14" rx="2" fill="#424242" /><rect x="111" y={y - 14} width="5" height="14" rx="2" fill="#424242" /><circle cx="100" cy={y + 6} r="4" fill="#424242" /></g>)}</g>)}</g>);
      break;
    case 'bombillo':
      el = (<g><circle cx="100" cy="88" r="46" fill={c} stroke="#ffe082" strokeWidth="2" /><path d="M78 124h44v20H78z" fill="#fafafa" /><rect x="80" y="144" width="40" height="26" rx="4" fill="#9e9e9e" /><path d="M80 150h40M80 158h40" stroke="#757575" strokeWidth="2" /><circle cx="84" cy="74" r="10" fill={light} /></g>);
      break;
    case 'balde': {
      const big = art.big, sm = art.small;
      el = (
        <g transform={sm ? 'translate(100 110) scale(.75) translate(-100 -110)' : undefined}>
          <path d={big ? 'M42 62h116l-8 106c0 5-4 8-9 8H59c-5 0-9-3-9-8z' : 'M52 62h96l-6 104c0 6-4 10-10 10H68c-6 0-10-4-10-10z'} fill="#fafafa" stroke="#e0e0e0" strokeWidth="2" />
          <ellipse cx="100" cy="62" rx={big ? 58 : 48} ry="10" fill="#e0e0e0" />
          <rect x={big ? 50 : 60} y="92" width={big ? 100 : 80} height="52" rx="4" fill={c} />
          <text x="100" y="124" textAnchor="middle" fontSize="12" fontWeight="800" fill={['#fafafa', '#f5f5f5', '#e3f2fd', '#eceff1'].includes(c) ? '#455a64' : '#fff'} fontFamily="Archivo, sans-serif">{t}</text>
          <path d={big ? 'M44 66c20 -40 92 -40 112 0' : 'M54 66c18 -36 74 -36 92 0'} stroke="#9e9e9e" strokeWidth="3" fill="none" />
          <path d="M62 70l-4 96" stroke={light} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
      break;
    }
    case 'rodillo':
      el = (<g><rect x="40" y="56" width="100" height="40" rx="18" fill={c} /><path d="M140 76h22v40h-56v20" stroke="#616161" strokeWidth="6" fill="none" strokeLinejoin="round" /><rect x="96" y="134" width="20" height="44" rx="8" fill="#212121" /></g>);
      break;
    case 'brocha':
      el = (<g transform="rotate(-30 100 110)"><rect x="70" y="40" width="60" height="50" rx="4" fill="#5d4037" /><rect x="66" y="88" width="68" height="20" rx="3" fill="#bdbdbd" /><rect x="88" y="108" width="24" height="70" rx="10" fill={c} /></g>);
      break;
    case 'baldosa':
      el = (<g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${44 + i * 10} ${120 - i * 26})`}><path d="M0 20l56-20 56 20-56 20z" fill={c} stroke="#fff" strokeWidth="2" /><path d="M0 20v8l56 20v-8zM112 20v8l-56 20v-8z" fill={dark} /></g>)}</g>);
      break;
    case 'martillo':
      el = (<g transform="rotate(-35 100 110)"><rect x="92" y="70" width="16" height="110" rx="6" fill={c} /><rect x="92" y="150" width="16" height="30" rx="6" fill="#212121" /><path d="M60 52h70c8 0 12 6 12 12v6H60z" fill="#616161" /><path d="M60 52c-14 0-22 10-24 22l24-4z" fill="#757575" /></g>);
      break;
    case 'pala':
      el = (<g transform="rotate(-20 100 110)"><rect x="96" y="20" width="8" height="110" rx="4" fill="#8d6e63" /><rect x="86" y="16" width="28" height="10" rx="4" fill="#212121" /><path d="M70 128h60v40c0 8-6 12-12 12H82c-6 0-12-4-12-12z" fill={c} /><rect x="94" y="120" width="12" height="14" fill="#616161" /></g>);
      break;
    case 'carretilla':
      el = (<g><path d="M40 70h110l-14 50H58z" fill={c} /><path d="M40 70h110" stroke="#b71c1c" strokeWidth="6" /><path d="M58 120l-26 30M136 120l40 24" stroke="#424242" strokeWidth="6" strokeLinecap="round" /><circle cx="72" cy="150" r="20" fill="#212121" /><circle cx="72" cy="150" r="8" fill="#9e9e9e" /><path d="M110 120l4 40" stroke="#424242" strokeWidth="6" /></g>);
      break;
    case 'palustre':
      el = (<g transform="rotate(-25 100 110)"><path d="M60 80l50-30 40 90z" fill="#b0bec5" stroke="#90a4ae" strokeWidth="2" /><path d="M110 50l-20 -20" stroke="#616161" strokeWidth="5" /><rect x="72" y="14" width="18" height="34" rx="8" fill={c} transform="rotate(-45 81 31)" /></g>);
      break;
    case 'nivel':
      el = (<g transform="rotate(-12 100 110)"><rect x="20" y="92" width="160" height="30" rx="4" fill={c} /><rect x="86" y="98" width="28" height="18" rx="6" fill="#a5d6a7" stroke="#2e7d32" /><circle cx="100" cy="107" r="4" fill="#fff" /><rect x="34" y="100" width="16" height="14" rx="5" fill="#a5d6a7" /><rect x="150" y="100" width="16" height="14" rx="5" fill="#a5d6a7" /></g>);
      break;
    case 'flexometro':
      el = (<g><rect x="54" y="66" width="80" height="80" rx="22" fill={c} /><circle cx="94" cy="106" r="22" fill="#212121" /><path d="M134 128h50v14h-50z" fill="#fdd835" /><path d="M140 128v6M148 128v4M156 128v6M164 128v4M172 128v6" stroke="#212121" strokeWidth="1.5" /></g>);
      break;
    case 'taladro':
      el = (<g><path d="M40 70h100c10 0 16 6 16 16v8c0 10-6 16-16 16H40z" fill={c} /><rect x="156" y="84" width="34" height="12" rx="3" fill="#9e9e9e" /><path d="M90 110h30l-6 60H82z" fill="#212121" /><rect x="74" y="164" width="52" height="16" rx="4" fill="#424242" /></g>);
      break;
    case 'tanque':
      el = (<g><path d="M48 70c0-14 24-24 52-24s52 10 52 24v86c0 10-24 18-52 18s-52-8-52-18z" fill={c} /><ellipse cx="100" cy="70" rx="52" ry="14" fill="#37474f" /><ellipse cx="100" cy="66" rx="20" ry="6" fill="#455a64" />{[100, 130].map((y) => <path key={y} d={`M48 ${y}c20 10 84 10 104 0`} stroke="#455a64" strokeWidth="2" fill="none" />)}</g>);
      break;
    case 'teja':
      el = (<g>{art.zinc ? [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${30 + i * 24} 160l${12} -100 ${12} 100`} fill={i % 2 ? c : '#b0bec5'} stroke="#78909c" />) : <path d="M30 150l30-90h110l-30 90z" fill={c} />}{!art.zinc && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${48 + i * 22} 150l30-90`} stroke="#90a4ae" strokeWidth="6" />)}</g>);
      break;
    case 'sanitario':
      el = (<g><rect x="96" y="40" width="64" height="56" rx="8" fill={c} stroke="#e0e0e0" strokeWidth="2" /><path d="M40 100h120c0 30-20 48-50 50l6 26H74l6-26c-24-4-40-22-40-50z" fill={c} stroke="#e0e0e0" strokeWidth="2" /><ellipse cx="96" cy="102" rx="54" ry="8" fill="#e0e0e0" /></g>);
      break;
    case 'lavamanos':
      el = (<g><path d="M30 90h140c0 30-30 56-70 56S30 120 30 90z" fill={c} stroke="#e0e0e0" strokeWidth="2" /><ellipse cx="100" cy="92" rx="56" ry="10" fill="#eeeeee" /><path d="M100 70v-24h18" stroke="#b0bec5" strokeWidth="6" fill="none" strokeLinecap="round" /></g>);
      break;
    case 'llave':
      el = art.shower
        ? (<g><path d="M60 50h60c10 0 16 6 16 16v20" stroke="#b0bec5" strokeWidth="8" fill="none" strokeLinecap="round" /><ellipse cx="136" cy="100" rx="30" ry="12" fill={c} stroke="#90a4ae" />{[-16, -8, 0, 8, 16].map((d) => <path key={d} d={`M${136 + d} 112l${d / 2} 40`} stroke="#81d4fa" strokeWidth="2" />)}</g>)
        : (<g><rect x="50" y="90" width="40" height="30" rx="6" fill={c} /><path d="M90 98h50c10 0 14 6 14 14v16" stroke={c} strokeWidth="14" fill="none" strokeLinecap="round" /><rect x="58" y="58" width="24" height="34" rx="4" fill="#90a4ae" /><rect x="46" y="54" width="48" height="10" rx="5" fill="#d32f2f" /></g>);
      break;
    case 'silicona':
      el = (<g transform="rotate(-30 100 110)"><rect x="40" y="90" width="110" height="34" rx="6" fill={c} stroke="#bdbdbd" /><rect x="60" y="96" width="60" height="22" rx="3" fill="#fbc02d" /><path d="M150 100l34 7-34 7z" fill="#9e9e9e" /><rect x="26" y="96" width="16" height="22" rx="3" fill="#616161" /></g>);
      break;
    default:
      el = <circle cx="100" cy="100" r="50" fill={c} />;
  }
  return (
    <svg viewBox="0 0 200 200" className={`art ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={sh}><stop offset="0" stopColor="rgba(0,0,0,.22)" /><stop offset="1" stopColor="rgba(0,0,0,0)" /></radialGradient>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".25" /><stop offset="1" stopColor="#000" stopOpacity=".08" /></linearGradient>
      </defs>
      <ellipse cx="100" cy="182" rx="70" ry="9" fill={`url(#${sh})`} />
      {el}
    </svg>
  );
}
