import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { usePedido } from '../pedido';
import { lockScroll, scrollToTarget } from '../lib/scroll';

const LINKS = [['#menu', 'Menú'], ['#anatomia', 'La 88'], ['#galeria', 'Galería'], ['#domicilio', 'Domicilios']];

export default function Nav() {
  const { unidades, setAbierto, pulso } = usePedido();
  const [solida, setSolida] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const f = () => setSolida(window.scrollY > 30);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const ir = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  return (
    <>
      <header className={`nav ${solida ? 'solida' : ''}`}>
        <div className="wrap nav__fila">
          <a href="#inicio" onClick={(e) => ir(e, 'body')} aria-label="88 Burger, inicio"><Logo /></a>
          <nav className="nav__links" aria-label="Principal">{LINKS.map(([h, l]) => <a key={h} href={h} onClick={(e) => ir(e, h)}>{l}</a>)}</nav>
          <div className="nav__der">
            <button type="button" className="nav__pedido" onClick={() => setAbierto(true)} aria-label={`Mi pedido: ${unidades} productos`}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
              <span className="nav__pedido-t">Pedido</span>
              {unidades > 0 && <em key={pulso}>{unidades}</em>}
            </button>
            <button type="button" className="hamb" onClick={() => setMenu(true)} aria-label="Abrir menú"><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`movil ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <button type="button" className="movil__x" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} aria-label="Cerrar">✕</button>
        <Logo />
        <nav>{LINKS.map(([h, l], i) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => ir(e, h)} style={{ '--i': i }}>{l}</a>)}</nav>
      </div>
    </>
  );
}
