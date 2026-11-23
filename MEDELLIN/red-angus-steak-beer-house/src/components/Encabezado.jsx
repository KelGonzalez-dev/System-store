import { useEffect, useState } from 'react';
import { Letrero } from './Logo';
import { lockScroll, scrollToTarget } from '../lib/scroll';

const LINKS = [['#casa', 'Nuestra casa'], ['#cortes', 'Cortes'], ['#carta', 'Carta'], ['#galeria', 'Galería'], ['#eventos', 'Eventos'], ['#reservas', 'Reservas']];

export default function Encabezado() {
  const [fijo, setFijo] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => { const f = () => setFijo(window.scrollY > 60); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { if (!menu) return undefined; lockScroll(true); return () => lockScroll(false); }, [menu]);
  const ir = (e, h) => { e.preventDefault(); setMenu(false); scrollToTarget(h); };
  return (
    <>
      <div className="franja-top">
        <div className="wrap"><span>El mejor steakhouse de Bogotá</span><span className="sep">·</span><span>¡Ahora también en Chía!</span></div>
      </div>
      <header className={`enc ${fijo ? 'fijo' : ''}`}>
        <div className="wrap enc__fila">
          <a href="#inicio" className="enc__logo" onClick={(e) => ir(e, 'body')} aria-label="Inicio"><Letrero conEst={false} /></a>
          <nav className="enc__nav" aria-label="Principal">{LINKS.map(([h, l]) => <a key={h} href={h} onClick={(e) => ir(e, h)}>{l}</a>)}</nav>
          <a href="#reservas" className="btn btn--borde enc__btn" onClick={(e) => ir(e, '#reservas')}>Reservar mesa</a>
          <button type="button" className="enc__hamb" onClick={() => setMenu(true)} aria-label="Abrir menú"><span /><span /><span /></button>
        </div>
      </header>
      <div className={`movil ${menu ? 'on' : ''}`} aria-hidden={!menu}>
        <button type="button" className="movil__x" onClick={() => setMenu(false)} tabIndex={menu ? 0 : -1} aria-label="Cerrar">✕</button>
        <Letrero />
        <nav>{LINKS.map(([h, l]) => <a key={h} href={h} tabIndex={menu ? 0 : -1} onClick={(e) => ir(e, h)}>{l}</a>)}</nav>
      </div>
    </>
  );
}
