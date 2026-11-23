import { useEffect, useState } from 'react';
import { Cupido, Nombre } from './Logo';
import { lockScroll, scrollToTarget } from '../lib/scroll';

const LINKS = [['#saloon', 'El saloon'], ['#noches', 'Noches'], ['#tragos', 'La barra'], ['#despedidas', 'Despedidas'], ['#galeria', 'Galería'], ['#reserva', 'Reservas']];

export default function Nav() {
  const [solida, setSolida] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => { const f = () => setSolida(window.scrollY > 30); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const ir = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  return (
    <>
      <header className={`nav ${solida ? 'solida' : ''}`}>
        <div className="wrap nav__fila">
          <a href="#inicio" className="nav__logo" onClick={(e) => ir(e, 'body')} aria-label="Canta Corazón, inicio"><Cupido /><Nombre /></a>
          <nav className="nav__links" aria-label="Principal">{LINKS.map(([h, l]) => <a key={h} href={h} onClick={(e) => ir(e, h)}>{l}</a>)}</nav>
          <div className="nav__der">
            <a href="#reserva" className="btn btn--coral btn--sm" onClick={(e) => ir(e, '#reserva')}>Reservar</a>
            <button type="button" className="hamb" onClick={() => setMenu(true)} aria-label="Abrir menú"><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={`movil ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <button type="button" className="movil__x" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} aria-label="Cerrar">✕</button>
        <Cupido className="movil__cupido" />
        <nav>{LINKS.map(([h, l], i) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => ir(e, h)} style={{ '--i': i }}>{l}</a>)}</nav>
      </div>
    </>
  );
}
