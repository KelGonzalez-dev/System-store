import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { subscribeScroll } from '../hooks/scrollBus';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/galeria', label: 'Galería' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar({ cartCount, onCartOpen, user, onAdmin, onLogout }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeScroll((y) => setSolid((s) => (s === (y > 40) ? s : y > 40))), []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav${solid || open ? ' solid' : ''}`}>
        <div className="nav__row">
          <Link to="/" className="nav__brand" onClick={close} aria-label="Guajira Bags">
            <img src="/images/logo.webp" alt="" width="38" height="38" />
            <span>Guajira Bags</span>
          </Link>

          <nav className="nav__links" aria-label="Principal">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {l.label}
                <span className="u" />
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            {user && (
              <>
                <button type="button" className="nav__pill nav__pill--panel" onClick={onAdmin}><LayoutDashboard size={15} /><span>Panel</span></button>
                <button type="button" className="nav__pill nav__pill--out" onClick={onLogout} aria-label="Cerrar sesión"><LogOut size={15} /><span>Cerrar sesión</span></button>
              </>
            )}
            <button type="button" className="nav__cart" onClick={onCartOpen} aria-label={`Carrito, ${cartCount} artículos`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" /></svg>
              {cartCount > 0 && <span className="nav__cart-badge">{cartCount}</span>}
            </button>
            <button type="button" className="nav__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="2" rx="1" fill="currentColor" style={{ transition: 'transform .3s', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} /><rect y="6" width="20" height="2" rx="1" fill="currentColor" style={{ transition: 'opacity .2s', opacity: open ? 0 : 1 }} /><rect y="12" width="20" height="2" rx="1" fill="currentColor" style={{ transition: 'transform .3s', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav__mobile${open ? ' open' : ''}`}>
        {LINKS.map((l, i) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={close} style={{ '--md': `${i * 60}ms` }} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {l.label}
          </NavLink>
        ))}
        {user && (
          <div className="nav__mobile-user">
            <button type="button" className="btn btn--line" onClick={() => { close(); onAdmin(); }}><LayoutDashboard size={16} />Panel administrativo</button>
            <button type="button" className="btn btn--gold" onClick={() => { close(); onLogout(); }}><LogOut size={16} />Cerrar sesión</button>
          </div>
        )}
        <div className="nav__mobile-foot">
          <button type="button" className="btn btn--gold" onClick={() => { close(); onCartOpen(); }}>Ver carrito ({cartCount})</button>
        </div>
      </div>
    </>
  );
}
