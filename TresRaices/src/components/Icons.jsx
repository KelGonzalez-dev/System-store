const Svg = ({ children, className = 'h-6 w-6', ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...p}>
    {children}
  </svg>
);

const paths = {
  sprout: (<><path d="M12 21v-9" /><path d="M12 12c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z" /><path d="M12 14.5c0-3-2-5-5.5-5 0 3 2 5 5.5 5Z" /></>),
  mountain: (<><path d="m3 19 6.5-11 4 6.5L16 11l5 8Z" /><path d="m8.2 10.8 1.3-.9 1.2.9" /></>),
  handshake: (<><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2" /><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.8-3.8a3 3 0 0 0-4.2 0l-.9.9a1.4 1.4 0 0 1-2-2l2.4-2.4a5 5 0 0 1 5.2-1.2L16 6" /><path d="m21 15-2.5-2.5V4.5H21Z" /><path d="m3 15 2.5-2.5V4.5H3Z" /><path d="M6 17.5 8 19.5a1.4 1.4 0 0 0 2-2" /></>),
  leaf: (<><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" /><path d="M5 19c2-5 5-8 9-10" /></>),
  users: (<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M17 14c2.5 0 4.5 2 4.5 4.6" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" /></>),
  drop: (<path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />),
  coffee: (<><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z" /><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H15.7" /><path d="M8 3.5c0 1.2 1 1.4 1 2.5M11.5 3.5c0 1.2 1 1.4 1 2.5" /></>),
  cacao: (<><path d="M12 3c4.4 1.6 7 5.6 7 9.5S15.9 21 12 21 5 16.4 5 12.5 7.6 4.6 12 3Z" /><path d="M12 3c-2 3-2.4 12 0 18M12 3c2 3 2.4 12 0 18" /></>),
  cane: (<><path d="M7 21 5 5" /><path d="M13 21 12 3" /><path d="M19 21 19 6" /><path d="M5.6 10h1.6M12.3 9h1.6M19 11h-1.2M5.9 16h1.6M12.6 15h1.6" /></>),
  pin: (<><path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>),
  phone: (<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  menu: (<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>),
  close: (<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  facebook: (<path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2H8v3.5h2.5V21H14v-7.5h2.5L17 10h-3V8.5c0-.3.2-.5.5-.5Z" />),
  youtube: (<><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" /></>),
};

export const Icon = ({ name, className }) => <Svg className={className}>{paths[name]}</Svg>;

export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.75.35-.25.27-1 1-1 2.4s1 2.8 1.15 3c.14.2 2 3.2 4.9 4.35 2.4.95 2.9.76 3.4.7.5-.05 1.65-.67 1.9-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.2-.55-.34-.28-.15-1.65-.82-1.9-.9-.26-.1-.45-.15-.63.14-.2.28-.72.9-.88 1.1-.16.18-.32.2-.6.06-.28-.15-1.18-.43-2.24-1.38-.83-.74-1.4-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.17.18-.28.28-.47.1-.18.05-.35-.02-.5-.07-.13-.63-1.5-.86-2.06-.23-.55-.46-.47-.63-.48h-.54Z" />
  </svg>
);
