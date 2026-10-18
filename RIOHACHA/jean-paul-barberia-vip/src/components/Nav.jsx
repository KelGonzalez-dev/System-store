import { useEffect, useState } from 'react';
import { Logo, WaIcon } from './Brand';
import { lockScroll, scrollToTarget } from '../lib/scroll';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const links = [['#experiencias', 'Experiencias'], ['#ritual', 'El ritual'], ['#precios', 'Precios'], ['#galeria', 'Galería'], ['#visitanos', 'Visítanos']];
  const go = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  return (
    <>
      <header className={`site-nav ${solid ? 'is-solid' : ''}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <a href="#inicio" onClick={(e) => go(e, 'body')} className="nav-logo" aria-label="Jean Paul Barbería VIP"><Logo /></a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {links.map(([h, l]) => <a key={h} href={h} onClick={(e) => go(e, h)} className="nav-link">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#agenda" onClick={(e) => go(e, '#agenda')} className="btn btn-gold !h-11 !px-5"><span className="hidden sm:inline">Agendar cita</span><span className="sm:hidden">Agendar</span></a>
            <button type="button" className="burger lg:hidden" onClick={() => setMenu(true)} aria-label="Abrir menú" aria-expanded={menu}><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <button type="button" className="mm-close" onClick={() => setMenu(false)} aria-label="Cerrar menú" tabIndex={menu ? 0 : -1}>✕</button>
        <Logo />
        <nav className="mt-10 flex flex-col items-center gap-1" aria-label="Móvil">
          {[...links, ['#agenda', 'Agendar cita']].map(([h, l], i) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => go(e, h)} className="mm-link" style={{ '--i': i }}>{l}</a>)}
        </nav>
        <p className="mm-wa"><WaIcon /> Respondemos por WhatsApp</p>
      </div>
    </>
  );
}
