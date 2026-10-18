// Marca: "Jean Paul" en cursiva con acabado de pan de oro y "BARBERÍA VIP"
export function Logo({ className = '', sub = true }) {
  return (
    <span className={`logo ${className}`}>
      <span className="lg-script">Jean Paul</span>
      {sub && <span className="lg-sub"><i />BARBERÍA VIP<i /></span>}
    </span>
  );
}

export const WaIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
);
