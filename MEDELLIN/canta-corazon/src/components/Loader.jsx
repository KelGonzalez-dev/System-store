import { useEffect, useRef, useState } from 'react';
import { Cupido, Lema, Nombre } from './Logo';
import { lockScroll, reducedMotion } from '../lib/scroll';

const CORAZON = 'M500 420C392 344 340 286 352 226c12-60 98-80 148-16 50-64 136-44 148 16 12 60-40 118-148 194z';

/**
 * Loader "El lazo del corazón":
 * un lazo vaquero gira en el aire, se lanza y dibuja un corazón con la cuerda; el cupido del logo entra
 * volando y lo atraviesa con su flecha; aparece "Canta Corazón · Saloon Sentimental", el corazón late
 * dos veces y la página se abre por dentro de un corazón que crece.
 */
export default function Loader({ onReveal, onDone }) {
  const [fase, setFase] = useState('in');
  const fin = useRef(() => {});
  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let libre = false;
    const liberar = () => { if (!libre) { libre = true; lockScroll(false); } };
    const ts = [];
    let hecho = false;
    const salir = () => {
      if (hecho) return;
      hecho = true;
      setFase('out');
      liberar();
      onReveal();
      ts.push(setTimeout(onDone, reduce ? 200 : 1300));
    };
    fin.current = salir;
    ts.push(setTimeout(salir, reduce ? 700 : 4700));
    return () => { ts.forEach(clearTimeout); liberar(); };
  }, [onReveal, onDone]);
  return (
    <div className={`ld ld--${fase}`} role="status" aria-label="Canta Corazón · Saloon Sentimental">
      <svg className="ld__svg" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="cuerda" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#E2522B" /><rect width="4" height="10" fill="#B83A1C" /></pattern>
        </defs>
        {/* lazo girando */}
        <g className="ld__lazo">
          <ellipse cx="500" cy="150" rx="150" ry="38" fill="none" stroke="url(#cuerda)" strokeWidth="9" />
        </g>
        <path className="ld__cuerda1" d="M380 160C280 260 160 420 -20 720" fill="none" stroke="url(#cuerda)" strokeWidth="9" strokeLinecap="round" />
        {/* flecha */}
        <g className="ld__flecha">
          <path d="M150 300L860 300" stroke="#2A1410" strokeWidth="7" strokeLinecap="round" />
          <path d="M860 300l-34-18v36z" fill="#2A1410" />
          <path d="M150 300l-30-22h28l26 22-26 22h-28z" fill="#E2522B" />
        </g>
        {/* corazón de cuerda */}
        <path className="ld__corazon" d={CORAZON} pathLength="1" fill="none" stroke="url(#cuerda)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path className="ld__cuerda2" d="M500 420C400 470 220 450 -20 480" pathLength="1" fill="none" stroke="url(#cuerda)" strokeWidth="9" strokeLinecap="round" />
      </svg>
      <div className="ld__cupido"><Cupido /></div>
      <div className="ld__marca">
        <Nombre />
        <Lema />
        <p className="ld__donde">El Poblado · Medellín</p>
      </div>
      <button type="button" className="ld__saltar" onClick={() => fin.current()}>Entrar</button>
    </div>
  );
}
