const P = {
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
  arrowLeft: (<><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>),
  arrowUp: (<><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>),
  menu: (<><path d="M4 8h16" /><path d="M4 16h16" /></>),
  close: (<><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>),
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>),
  check: (<path d="m5 12.5 4.5 4.5L19 7.5" />),
  spark: (<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" />),
};

export const Icon = ({ name, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {P[name]}
  </svg>
);

export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.75.35-.25.27-1 1-1 2.4s1 2.8 1.15 3c.14.2 2 3.2 4.9 4.35 2.4.95 2.9.76 3.4.7.5-.05 1.65-.67 1.9-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.2-.55-.34-.28-.15-1.65-.82-1.9-.9-.26-.1-.45-.15-.63.14-.2.28-.72.9-.88 1.1-.16.18-.32.2-.6.06-.28-.15-1.18-.43-2.24-1.38-.83-.74-1.4-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.12.28-.32.42-.48.14-.17.18-.28.28-.47.1-.18.05-.35-.02-.5-.07-.13-.63-1.5-.86-2.06-.23-.55-.46-.47-.63-.48h-.54Z" />
  </svg>
);
