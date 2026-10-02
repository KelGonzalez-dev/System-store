const P = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  arrowUp: (<><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>),
  menu: (<><path d="M4 8h16" /><path d="M4 16h16" /></>),
  close: (<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>),
  pin: (<><path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>),
  phone: (<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  heart: (<path d="M12 20s-7.5-4.6-9.8-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.8 5c-2.3 4.4-9.8 9-9.8 9Z" />),
  book: (<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5a1.5 1.5 0 0 1-1.5 1.5H6.5A2.5 2.5 0 0 0 4 22Z" /><path d="M4 5.5v14A2.5 2.5 0 0 0 6.5 22H17" /></>),
};

export const Icon = ({ name, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {P[name]}
  </svg>
);

export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.75.35-.25.27-1 1-1 2.4s1 2.8 1.15 3c.14.2 2 3.2 4.9 4.35 2.4.95 2.9.76 3.4.7.5-.05 1.65-.67 1.9-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.2-.55-.34-.28-.15-1.65-.82-1.9-.9-.26-.1-.45-.15-.63.14-.2.28-.72.9-.88 1.1-.16.18-.32.2-.6.06-.28-.15-1.18-.43-2.24-1.38-.83-.74-1.4-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.17.18-.28.28-.47.1-.18.05-.35-.02-.5-.07-.13-.63-1.5-.86-2.06-.23-.55-.46-.47-.63-.48h-.54Z" />
  </svg>
);
