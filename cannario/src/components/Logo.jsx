// Emblema de Cannario (cinco hojas doradas)
export const FLAME = [
  'M50 6C61 22 65 38 50 60 35 38 39 22 50 6Z',
  'M40 62C28 52 22 38 24 22 36 30 44 44 46 62Z',
  'M60 62C72 52 78 38 76 22 64 30 56 44 54 62Z',
  'M33 70C18 62 9 50 8 38 22 42 32 54 38 70Z',
  'M67 70C82 62 91 50 92 38 78 42 68 54 62 70Z',
  'M44 74 50 94 56 74',
];

export function GoldDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EED39A" />
          <stop offset=".5" stopColor="#C9962F" />
          <stop offset="1" stopColor="#94691B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ className = 'w-7', fill = 'url(#gg)' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      {FLAME.slice(0, 5).map((d) => <path key={d} d={d} fill={fill} />)}
      <path d={FLAME[5]} fill="none" stroke={fill} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
