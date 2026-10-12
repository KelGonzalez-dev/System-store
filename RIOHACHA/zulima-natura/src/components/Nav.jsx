import { useEffect, useState } from 'react';
import { Logo } from './Brand';
import { useBag } from '../bag';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export function BagIcon() {
  return <svg viewBox="0 0 24 24" className="h-[20px] w-[20px] fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>;
}

export default function Nav() {
  const { count, setOpen, pulse } = useBag();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 30);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const links = [['#catalogo', 'Catálogo'], ['#favoritos', 'Favoritos'], ['#ritual', 'Tu ritual'], ['#aroma', 'Tu aroma'], ['#regalos', 'Regalos'], ['#zulima', 'Sobre mí']];
  const go = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  return (
    <>
      <header className={`site-nav ${solid ? 'is-solid' : ''}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#inicio" onClick={(e) => go(e, 'body')} aria-label="Zulima · inicio"><Logo /></a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="nav-link">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="bag-btn" onClick={() => setOpen(true)} aria-label={`Tu bolsa: ${count} productos`}>
              <BagIcon />
              {count > 0 && <span key={pulse} className="bag-count">{count}</span>}
            </button>
            <button type="button" className="burger lg:hidden" onClick={() => setMenu(true)} aria-label="Abrir menú" aria-expanded={menu}><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <button type="button" className="mm-close" onClick={() => setMenu(false)} aria-label="Cerrar menú" tabIndex={menu ? 0 : -1}>✕</button>
        <Logo />
        <nav className="mt-8 flex flex-col items-center gap-2" aria-label="Móvil">
          {links.map(([h, l], i) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => go(e, h)} className="mm-link" style={{ '--i': i }}>{l}</a>)}
        </nav>
      </div>
    </>
  );
}
