const P = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  arrowLeft: (<><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>),
  arrowUp: (<><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>),
  menu: (<><path d="M4 8h16" /><path d="M4 16h16" /></>),
  close: (<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>),
  plus: (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  minus: (<path d="M5 12h14" />),
  pin: (<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>),
  bag: (<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>),
  swap: (<><path d="M7 4 3 8l4 4" /><path d="M3 8h14" /><path d="m17 20 4-4-4-4" /><path d="M21 16H7" /></>),
  check: (<path d="m5 12.5 4.5 4.5L19 7.5" />),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  moon: (<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />),
  trash: (<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>),
};

export const Icon = ({ name, className = 'h-5 w-5', stroke = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {P[name]}
  </svg>
);

export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.75.35-.25.27-1 1-1 2.4s1 2.8 1.15 3c.14.2 2 3.2 4.9 4.35 2.4.95 2.9.76 3.4.7.5-.05 1.65-.67 1.9-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.2-.55-.34-.28-.15-1.65-.82-1.9-.9-.26-.1-.45-.15-.63.14-.2.28-.72.9-.88 1.1-.16.18-.32.2-.6.06-.28-.15-1.18-.43-2.24-1.38-.83-.74-1.4-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.17.18-.28.28-.47.1-.18.05-.35-.02-.5-.07-.13-.63-1.5-.86-2.06-.23-.55-.46-.47-.63-.48h-.54Z" />
  </svg>
);

export function ItemIcon({ type, color, className = 'h-full w-full' }) {
  const c = color || '#62bf00';
  if (type === 'sandwich')
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path d="M8 26c0-9 10-14 24-14s24 5 24 14c0 2-2 3-4 3H12c-2 0-4-1-4-3Z" fill="#e9b872" />
        <rect x="8" y="30" width="48" height="5" rx="2.5" fill="#62bf00" />
        <rect x="10" y="34" width="44" height="5" rx="2.5" fill={c} />
        <rect x="8" y="39" width="48" height="4" rx="2" fill="#ffd166" />
        <path d="M8 45h48v3c0 3-3 5-6 5H14c-3 0-6-2-6-5v-3Z" fill="#e9b872" />
      </svg>
    );
  if (type === 'plate')
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <circle cx="32" cy="34" r="25" fill="#fff" stroke="#dfe6d6" strokeWidth="2" />
        <circle cx="32" cy="34" r="17" fill="#f3f6ee" />
        <ellipse cx="27" cy="33" rx="10" ry="7" fill={c} />
        <ellipse cx="40" cy="38" rx="6" ry="4.5" fill="#f5c542" />
        <circle cx="37" cy="27" r="4" fill="#62bf00" />
      </svg>
    );
  if (type === 'bowl')
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <circle cx="22" cy="24" r="8" fill="#ff7a45" />
        <circle cx="35" cy="20" r="8" fill="#ffd166" />
        <circle cx="45" cy="27" r="7" fill="#62bf00" />
        <circle cx="30" cy="30" r="7" fill={c} />
        <path d="M8 32h48c0 14-10 24-24 24S8 46 8 32Z" fill="#fff" stroke="#dfe6d6" strokeWidth="2" />
      </svg>
    );
  const tall = type === 'shake';
  const top = tall ? 14 : 18;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`cl-${type}`}><path d={`M16 ${top}h32l-4 40a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4l-4-40Z`} /></clipPath>
      </defs>
      <path d={`M16 ${top}h32l-4 40a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4l-4-40Z`} fill="rgba(255,255,255,.55)" stroke="#cfd8c4" strokeWidth="2" />
      <g clipPath={`url(#cl-${type})`}>
        <rect className="cup-liquid" x="12" y={top + 4} width="40" height={64 - top - 2} fill={c} />
        <rect x="12" y={top + 4} width="40" height="5" fill="rgba(255,255,255,.35)" />
      </g>
      {tall && <path d="M17 14c0-7 6-9 15-9s15 2 15 9H17Z" fill="#fff" stroke="#e5ebde" strokeWidth="1.5" />}
      <path d={tall ? 'M38 8 44 -2' : 'M38 18 46 4'} stroke="#62bf00" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
