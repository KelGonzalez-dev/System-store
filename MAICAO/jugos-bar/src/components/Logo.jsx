import { LOGO, LOGO_VB } from '../data/logoData';

const { o } = LOGO;
const mid = (o.ro + o.hole) / 2;
const sw = o.ro - o.hole;
const ringD = `M${o.cx} ${o.cy - mid}A${mid} ${mid} 0 1 1 ${o.cx} ${o.cy + mid}A${mid} ${mid} 0 1 1 ${o.cx} ${o.cy - mid}`;

export default function Logo({ className = '', label = 'Jugos Bar' }) {
  return (
    <svg viewBox={LOGO_VB} className={className} role="img" aria-label={label} fill="currentColor">
      {['J', 'u', 'g', 's'].map((k) => <path key={k} d={LOGO.letters[k]} />)}
      {['B', 'a', 'r'].map((k) => <path key={k} d={LOGO.bar[k]} />)}
      <path d={ringD} fill="none" stroke="currentColor" strokeWidth={sw} />
      <circle cx={o.cx} cy={o.cy} r={o.hole - 9} fill="none" stroke="currentColor" strokeWidth="3" />
      <g fill="none" strokeLinecap="round">
        <path d={LOGO.strawD} stroke="var(--knock, #070906)" strokeWidth="16" />
        <path d={LOGO.hookD} stroke="var(--knock, #070906)" strokeWidth="16" />
        <path d={LOGO.strawD} stroke="currentColor" strokeWidth="8" />
        <path d={LOGO.hookD} stroke="currentColor" strokeWidth="8" />
        <path d={LOGO.leafD} stroke="currentColor" strokeWidth="9" />
      </g>
    </svg>
  );
}

export function Mark({ className = '' }) {
  return (
    <svg viewBox={`${o.cx - 80} ${o.cy - 110} 160 190`} className={className} fill="none" aria-hidden="true">
      <path d={ringD} stroke="currentColor" strokeWidth={sw} />
      <circle cx={o.cx} cy={o.cy} r={o.hole - 9} stroke="currentColor" strokeWidth="3" />
      <g strokeLinecap="round">
        <path d={LOGO.strawD} stroke="var(--knock, #070906)" strokeWidth="16" />
        <path d={LOGO.hookD} stroke="var(--knock, #070906)" strokeWidth="16" />
        <path d={LOGO.strawD} stroke="currentColor" strokeWidth="8" />
        <path d={LOGO.hookD} stroke="currentColor" strokeWidth="8" />
      </g>
    </svg>
  );
}

const DROPS = [
  [-96, -118, 7, 0], [-62, -150, 5, 0.03], [-24, -164, 8, 0.05], [18, -158, 6, 0.02], [58, -146, 9, 0.06],
  [96, -112, 6, 0.04], [-122, -78, 5, 0.07], [124, -70, 7, 0.01], [-40, -122, 4, 0.09], [44, -128, 4, 0.08],
  [-8, -186, 5, 0.1], [78, -170, 4, 0.12],
];
const TONES = ['#ffffff', '#d9ff8a', '#ffffff', '#f2ffc4'];

export function LogoLoader({ ringRef }) {
  const L = LOGO.letters;
  const B = LOGO.bar;
  const sx = o.cx;
  const sy = o.cy - 4;
  return (
    <svg viewBox={LOGO_VB} className="ld-svg" role="img" aria-label="Jugos Bar" fill="#fff">
      <g style={{ '--d': '1.4s', '--fx': '-34px', '--fy': '0px' }} className="ld-in"><path d={L.J} /></g>
      <g style={{ '--d': '1.48s', '--fx': '-30px', '--fy': '0px' }} className="ld-in"><path d={L.u} /></g>
      <g style={{ '--d': '1.56s', '--fx': '-26px', '--fy': '0px' }} className="ld-in"><path d={L.g} /></g>
      <g style={{ '--d': '1.64s', '--fx': '34px', '--fy': '0px' }} className="ld-in"><path d={L.s} /></g>

      <g className="ld-bounce">
        <path ref={ringRef} className="ld-ring" pathLength="1" d={ringD} fill="none" stroke="#fff" strokeWidth={sw} />
        <circle className="ld-thin" cx={o.cx} cy={o.cy} r={o.hole - 9} fill="none" stroke="#fff" strokeWidth="3" />
        <circle className="ld-juice" cx={o.cx} cy={o.cy} r={o.hole - 2} fill="#d9ff8a" />
      </g>

      <circle className="ld-ripple" cx={sx} cy={sy} r="22" style={{ '--d': '1.32s' }} />
      <circle className="ld-ripple" cx={sx} cy={sy} r="22" style={{ '--d': '1.5s' }} />

      <g className="ld-straw" fill="none" strokeLinecap="round">
        <path d={LOGO.strawD} stroke="#62bf00" strokeWidth="16" />
        <path d={LOGO.hookD} stroke="#62bf00" strokeWidth="16" />
        <path d={LOGO.strawD} stroke="#fff" strokeWidth="8" />
        <path d={LOGO.hookD} stroke="#fff" strokeWidth="8" />
      </g>

      {DROPS.map(([tx, ty, r, dl], i) => (
        <circle key={i} className="ld-drop" cx={sx} cy={sy} r={r} fill={TONES[i % 4]} style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, '--d': `${(1.34 + dl).toFixed(2)}s` }} />
      ))}

      <g style={{ '--d': '1.9s', '--fx': '0px', '--fy': '26px' }} className="ld-in">
        <path d={B.B} /><path d={B.a} /><path d={B.r} />
      </g>
      <path className="ld-leaf" pathLength="1" d={LOGO.leafD} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
