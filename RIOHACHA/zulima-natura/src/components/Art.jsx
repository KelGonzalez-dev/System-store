import { useId } from 'react';

// Ilustraciones propias de los productos (SVG): livianas, nítidas en cualquier tamaño
// k: tipo de envase · c: color del producto · a: color de tapa/acento · label: línea
export default function Art({ art, label = '', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const { k, c, a } = art;
  const g = `g${uid}`, s = `s${uid}`;
  const Label = ({ x = 100, y, w = 64 }) => (
    <g>
      <rect x={x - w / 2} y={y - 11} width={w} height="22" rx="4" fill="rgba(255,255,255,0.78)" />
      <text x={x} y={y + 4} textAnchor="middle" className="art-label">{label}</text>
    </g>
  );
  let body;
  switch (k) {
    case 'perfume-square':
      body = (<g><rect x="88" y="44" width="24" height="18" rx="3" fill={a} /><rect x="78" y="58" width="44" height="26" rx="6" fill={a} /><rect x="52" y="80" width="96" height="118" rx="16" fill={`url(#${g})`} /><rect x="60" y="88" width="16" height="96" rx="8" fill="rgba(255,255,255,0.35)" /><Label y={150} /></g>);
      break;
    case 'perfume-round':
      body = (<g><rect x="90" y="42" width="20" height="16" rx="3" fill={a} /><rect x="82" y="54" width="36" height="26" rx="8" fill={a} /><circle cx="100" cy="142" r="62" fill={`url(#${g})`} /><ellipse cx="78" cy="118" rx="12" ry="26" fill="rgba(255,255,255,0.35)" transform="rotate(25 78 118)" /><Label y={150} /></g>);
      break;
    case 'perfume-tall':
      body = (<g><rect x="90" y="30" width="20" height="14" rx="3" fill={a} /><path d="M80 40h40l-4 28H84z" fill={a} /><rect x="66" y="66" width="68" height="136" rx="12" fill={`url(#${g})`} /><rect x="72" y="74" width="12" height="118" rx="6" fill="rgba(255,255,255,0.35)" /><Label y={150} w={58} /></g>);
      break;
    case 'perfume-flask':
      body = (<g><rect x="90" y="40" width="20" height="14" rx="3" fill={a} /><rect x="84" y="50" width="32" height="24" rx="6" fill={a} /><path d="M70 74h60c14 0 22 10 22 24v84c0 12-8 20-20 20H68c-12 0-20-8-20-20V98c0-14 8-24 22-24z" fill={`url(#${g})`} /><path d="M58 96c0-10 4-14 10-14v100c-6 0-10-4-10-12z" fill="rgba(255,255,255,0.35)" /><Label y={148} /></g>);
      break;
    case 'tube':
      body = (<g><path d="M66 40h68l-6 128H72z" fill={`url(#${g})`} /><path d="M66 40h68v8H66z" fill="rgba(0,0,0,0.12)" /><rect x="80" y="166" width="40" height="32" rx="6" fill={a} /><path d="M74 52h10l-4 104h-4z" fill="rgba(255,255,255,0.35)" /><Label y={110} w={56} /></g>);
      break;
    case 'jar':
      body = (<g><rect x="50" y="88" width="100" height="26" rx="8" fill={a} /><rect x="46" y="108" width="108" height="88" rx="18" fill={`url(#${g})`} /><rect x="56" y="118" width="14" height="66" rx="7" fill="rgba(255,255,255,0.35)" /><Label y={155} /></g>);
      break;
    case 'pump':
      body = (<g><path d="M96 34h30v10h-20v18h-10z" fill={a} /><rect x="88" y="58" width="24" height="18" rx="4" fill={a} /><rect x="62" y="74" width="76" height="126" rx="18" fill={`url(#${g})`} /><rect x="70" y="84" width="12" height="104" rx="6" fill="rgba(255,255,255,0.35)" /><Label y={140} w={60} /></g>);
      break;
    case 'bottle':
      body = (<g><rect x="86" y="38" width="28" height="22" rx="4" fill={a} /><path d="M88 58h24v14c18 6 26 18 26 34v84c0 8-6 12-12 12H74c-6 0-12-4-12-12v-84c0-16 8-28 26-34z" fill={`url(#${g})`} /><rect x="70" y="104" width="12" height="84" rx="6" fill="rgba(255,255,255,0.35)" /><Label y={150} w={60} /></g>);
      break;
    case 'soap':
      body = (<g><rect x="40" y="96" width="120" height="70" rx="22" fill={`url(#${g})`} /><rect x="40" y="96" width="120" height="70" rx="22" fill="none" stroke="rgba(0,0,0,0.08)" /><path d="M58 110c18-8 50-8 70 0" stroke="rgba(255,255,255,0.6)" strokeWidth="6" strokeLinecap="round" fill="none" /><path d="M96 84c-10-14-4-30 10-34 2 14-2 26-10 34zm8 0c6-12 18-16 28-10-6 10-16 14-28 10z" fill={a} /><Label y={140} /></g>);
      break;
    default: // kit
      body = (<g><rect x="42" y="96" width="116" height="100" rx="10" fill={`url(#${g})`} /><rect x="36" y="80" width="128" height="26" rx="8" fill={c} stroke="rgba(0,0,0,0.08)" /><rect x="94" y="80" width="12" height="116" fill={a} /><path d="M100 80c-18-26-44-18-36-4 6 8 24 6 36 4zm0 0c18-26 44-18 36-4-6 8-24 6-36 4z" fill={a} /><Label y={160} w={52} /></g>);
  }
  return (
    <svg viewBox="0 0 200 230" className={`art ${className}`} role="img" aria-label={label}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c} stopOpacity=".75" /><stop offset=".5" stopColor={c} /><stop offset="1" stopColor={a} stopOpacity=".55" /></linearGradient>
        <radialGradient id={s} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="rgba(0,0,0,0.18)" /><stop offset="1" stopColor="rgba(0,0,0,0)" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="206" rx="64" ry="10" fill={`url(#${s})`} />
      {body}
    </svg>
  );
}
