import { useEffect, useState } from 'react';
import { CartIcon, Logo, WaIcon } from './Brand';
import { CONFIG, waLink } from '../data';
import { useQuote } from '../quote';
import { status } from '../lib/hours';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export default function Header({ onSearch }) {
  const { count, setOpen, bump } = useQuote();
  const [st, setSt] = useState(status);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    const id = setInterval(() => setSt(status()), 60000);
    return () => { window.removeEventListener('scroll', f); clearInterval(id); };
  }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const links = [['#categorias', 'Categorías'], ['#promociones', 'Promociones'], ['#catalogo', 'Catálogo'], ['#calculadora', 'Calculadora'], ['#noticias', 'Noticias'], ['#galeria', 'Galería'], ['#contacto', 'Contacto']];
  const go = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  const submit = (e) => { e.preventDefault(); onSearch(q); setMenu(false); };
  return (
    <>
      <div className="topbar">
        <div className="wrap flex items-center justify-between gap-4">
          <span className={`tb-status ${st.open ? 'on' : ''}`}><i />{st.text}</span>
          <span className="hidden md:inline">📍 {CONFIG.address}, {CONFIG.city.split(',')[0]}</span>
          <a href={waLink('¡Hola! Quiero hacer un pedido / consulta.')} target="_blank" rel="noopener noreferrer" className="tb-wa"><WaIcon className="h-4 w-4" /> Pedidos: 318 400 9867</a>
        </div>
      </div>
      <header className={`header ${solid ? 'is-solid' : ''}`}>
        <div className="wrap hd-row">
          <a href="#inicio" onClick={(e) => go(e, 'body')} aria-label="Inicio"><Logo /></a>
          <form className="hd-search" onSubmit={submit} role="search">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cemento, varilla, pegante, tubo…" aria-label="Buscar productos" />
            <button type="submit">Buscar</button>
          </form>
          <div className="flex items-center gap-2">
            <button type="button" className="hd-quote" onClick={() => setOpen(true)} aria-label={`Mi cotización: ${count} productos`}>
              <CartIcon /><span className="hidden sm:inline">Cotización</span>
              {count > 0 && <em key={bump}>{count}</em>}
            </button>
            <button type="button" className="burger lg:hidden" onClick={() => setMenu(true)} aria-label="Abrir menú"><span /><span /><span /></button>
          </div>
        </div>
        <nav className="wrap hd-nav hidden lg:flex" aria-label="Principal">
          {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)}>{l}</a>)}
        </nav>
      </header>
      <div className={`mobile-menu ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <div className="mm-head"><Logo /><button type="button" onClick={() => setMenu(false)} aria-label="Cerrar menú" tabIndex={menu ? 0 : -1}>✕</button></div>
        <form className="hd-search mm-search" onSubmit={submit} role="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos…" aria-label="Buscar productos" tabIndex={menu ? 0 : -1} />
          <button type="submit" tabIndex={menu ? 0 : -1}>Buscar</button>
        </form>
        <nav className="mm-nav" aria-label="Móvil">{links.map(([h, l], i) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => go(e, h)} style={{ '--i': i }}>{l}<span>›</span></a>)}</nav>
        <a href={waLink('¡Hola! Quiero hacer un pedido / consulta.')} target="_blank" rel="noopener noreferrer" className="btn btn-wa w-full" tabIndex={menu ? 0 : -1}><WaIcon /> Escribir por WhatsApp</a>
      </div>
    </>
  );
}
