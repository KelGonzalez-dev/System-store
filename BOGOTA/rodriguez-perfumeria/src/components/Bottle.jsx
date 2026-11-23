import { useId } from 'react';

const SHAPES = {
  classic: { body: 'M54 80H146A14 14 0 0 1 160 94V262A14 14 0 0 1 146 276H54A14 14 0 0 1 40 262V94A14 14 0 0 1 54 80Z', top: 80, h: 196, my: 190, gx: 52 },
  round: { body: 'M20 196A80 80 0 1 1 180 196A80 80 0 1 1 20 196Z', top: 116, h: 160, my: 196, gx: 36 },
  tall: { body: 'M72 100H128A8 8 0 0 1 136 108V272A8 8 0 0 1 128 280H72A8 8 0 0 1 64 272V108A8 8 0 0 1 72 100Z', top: 100, h: 180, my: 196, gx: 72 },
  arab: { body: 'M100 92C142 112 166 168 158 226C153 260 130 280 100 280C70 280 47 260 42 226C34 168 58 112 100 92Z', top: 92, h: 188, my: 206, gx: 56 },
};

function Cap({ shape, gold, goldV }) {
  switch (shape) {
    case 'round':
      return (
        <g>
          <rect x="90" y="70" width="20" height="34" fill={goldV} />
          <circle cx="100" cy="50" r="28" fill={gold} />
          <ellipse cx="91" cy="40" rx="7" ry="12" fill="#fff" opacity=".35" transform="rotate(-25 91 40)" />
        </g>
      );
    case 'tall':
      return (
        <g>
          <rect x="88" y="82" width="24" height="24" fill={goldV} />
          <rect x="76" y="16" width="48" height="70" rx="5" fill={gold} />
          {[28, 38, 48, 58, 68].map((y) => <line key={y} x1="76" x2="124" y1={y} y2={y} stroke="#4a3412" strokeOpacity=".35" />)}
          <rect x="82" y="20" width="6" height="62" rx="3" fill="#fff" opacity=".3" />
        </g>
      );
    case 'arab':
      return (
        <g>
          <rect x="90" y="68" width="20" height="30" fill={goldV} />
          <path d="M72 70L78 34L90 52L100 18L110 52L122 34L128 70Z" fill={gold} />
          <circle cx="100" cy="17" r="4" fill="#f6e3b0" />
          <path d="M84 68L88 44" stroke="#fff" strokeOpacity=".3" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="86" y="62" width="28" height="24" fill={goldV} />
          <rect x="70" y="12" width="60" height="54" rx="5" fill={gold} />
          <rect x="76" y="16" width="7" height="46" rx="3.5" fill="#fff" opacity=".3" />
          <line x1="70" x2="130" y1="58" y2="58" stroke="#4a3412" strokeOpacity=".4" />
        </g>
      );
  }
}

export default function Bottle({ shape = 'classic', liquid = '#b9772a', className = '', monogram = true }) {
  const u = useId().replace(/:/g, '');
  const s = SHAPES[shape] || SHAPES.classic;
  const gold = `url(#gd${u})`;
  const goldV = `url(#gv${u})`;

  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`gd${u}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7a5a25" /><stop offset=".3" stopColor="#f6e3b0" /><stop offset=".55" stopColor="#c9a05a" /><stop offset="1" stopColor="#6f5121" />
        </linearGradient>
        <linearGradient id={`gv${u}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d9b36a" /><stop offset="1" stopColor="#6f5121" />
        </linearGradient>
        <linearGradient id={`gl${u}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".5" stopColor="#fff" stopOpacity=".03" /><stop offset="1" stopColor="#fff" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={`gs${u}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".62" />
        </linearGradient>
        <linearGradient id={`gg${u}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`c${u}`}><path d={s.body} /></clipPath>
      </defs>

      <ellipse cx="100" cy="288" rx="72" ry="7" fill="#000" opacity=".55" />
      <path d={s.body} fill={`url(#gl${u})`} />
      <g clipPath={`url(#c${u})`}>
        <g style={{ transform: `translateY(calc((1 - var(--lvl, .82)) * ${s.h}px))`, transition: 'transform .12s linear' }}>
          <rect x="0" y={s.top} width="200" height={s.h + 4} fill={liquid} />
          <rect x="0" y={s.top} width="200" height={s.h + 4} fill={`url(#gs${u})`} />
          <rect x="0" y={s.top} width="200" height="3" fill="#fff" opacity=".35" />
        </g>
        <rect x={s.gx} y={s.top + 8} width="9" height={s.h - 34} rx="4.5" fill={`url(#gg${u})`} opacity=".65" />
      </g>
      <path d={s.body} fill="none" stroke="#f1d9a0" strokeOpacity=".5" strokeWidth="1.5" />
      <Cap shape={shape} gold={gold} goldV={goldV} />
      {monogram && (
        <g transform={`translate(100 ${s.my})`}>
          <circle r="17" fill="#050403" fillOpacity=".35" stroke="#f1d9a0" strokeOpacity=".8" strokeWidth=".8" />
          <text y="7" textAnchor="middle" fontSize="22" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="500" fill="#f1d9a0">R</text>
        </g>
      )}
    </svg>
  );
}
