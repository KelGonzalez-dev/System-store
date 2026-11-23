import { useRef } from 'react';
import Foto from './Foto';
import { WaIcon } from './Logo';
import { CONFIG, MENU, fmt, waLink } from '../data';
import { useScrollFrame, useTilt, scrollToTarget } from '../lib/scroll';
import { abierto } from '../lib/horario';

const estrella = MENU.find((m) => m.id === 'avalancha');

/**
 * Hero: "No es una hamburguesa más." (frase de su Instagram) con un "88" gigante de fondo,
 * la hamburguesa estrella en un plato rojo con anillo de texto girando, ingredientes que flotan
 * con el mouse, y al bajar la hamburguesa gira y se aleja en 3D.
 */
export default function Hero({ onPedir }) {
  const sec = useRef(null);
  const plato = useRef(null);
  useTilt(plato, 12);
  useScrollFrame(sec, (p) => {
    const k = Math.min(1, Math.max(0, (p - 0.5) * 2));
    sec.current?.style.setProperty('--k', k.toFixed(3));
  });
  const ab = abierto();
  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero__88" aria-hidden="true">88</div>
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow intro" style={{ '--d': '.1s' }}>
            <span className={`dot ${ab.abierto ? 'on' : ''}`} />{ab.texto} · {CONFIG.ciudad}
          </p>
          <h1 className="hero__h1">
            <span className="ln"><span style={{ '--i': 0 }}>No es una</span></span>
            <span className="ln"><span style={{ '--i': 1 }}>hamburguesa</span></span>
            <span className="ln"><span className="queso" style={{ '--i': 2 }}>más.</span></span>
          </h1>
          <p className="hero__p intro" style={{ '--d': '.9s' }}>Sabores premium en Cúcuta: hamburguesas con queso que se derrite, perros, salchipapas y picadas. <b>Te lo llevamos a domicilio.</b></p>
          <div className="hero__cta intro" style={{ '--d': '1.05s' }}>
            <button type="button" className="btn btn--queso" onClick={() => scrollToTarget('#menu')}>Ver el menú</button>
            <a className="btn btn--wa" href={waLink('¡Hola 88 Burger! 🍔 Quiero hacer un pedido a domicilio.')} target="_blank" rel="noopener noreferrer"><WaIcon /> Pedir a domicilio</a>
          </div>
          <ul className="hero__datos intro" style={{ '--d': '1.2s' }}>
            <li><b>{CONFIG.seguidores}</b><span>seguidores</span></li>
            <li><b>4 PM</b><span>a 1 AM</span></li>
            <li><b>Domicilio</b><span>a toda Cúcuta</span></li>
          </ul>
        </div>
        <div className="hero__plato intro-pop">
          <div ref={plato} className="plato" onClick={() => onPedir(estrella)} role="button" tabIndex={0} aria-label={`Ver ${estrella.nombre}`}>
            <svg className="plato__anillo" viewBox="0 0 400 400" aria-hidden="true">
              <defs><path id="anillo88" d="M200 200 m-176 0 a176 176 0 1 1 352 0 a176 176 0 1 1 -352 0" /></defs>
              <text><textPath href="#anillo88" textLength="1090" lengthAdjust="spacing">88 BURGER ✦ SABORES PREMIUM ✦ CÚCUTA ✦ DOMICILIOS ✦</textPath></text>
            </svg>
            <span className="plato__disco" />
            <Foto id={estrella.foto} arte="burger" alt={estrella.nombre} w={1000} eager className="plato__foto" />
            <span className="plato__precio"><small>La más pedida</small><b>{estrella.nombre}</b><em>{fmt(estrella.precio)}</em></span>
          </div>
          <svg className="flota f1" viewBox="0 0 40 120" aria-hidden="true"><rect x="8" y="4" width="24" height="112" rx="6" fill="#FFC531" /><rect x="12" y="10" width="6" height="96" rx="3" fill="#FFE08A" /></svg>
          <svg className="flota f2" viewBox="0 0 140 50" aria-hidden="true"><path d="M6 30c18-24 34 10 52-12s34 12 52-10 22 6 24 4v14c-6 4-14-8-26 6s-34-16-52 10S20 26 6 44z" fill="#B4432B" /><path d="M14 30c16-14 30 8 46-8s30 10 46-6" stroke="#FFD8B0" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
          <svg className="flota f3" viewBox="0 0 120 110" aria-hidden="true"><path d="M8 10h104L60 104z" fill="#FFC531" /><circle cx="44" cy="34" r="7" fill="#F2A900" /><circle cx="74" cy="48" r="5" fill="#F2A900" /><circle cx="58" cy="70" r="4" fill="#F2A900" /></svg>
          <svg className="flota f4" viewBox="0 0 60 60" aria-hidden="true"><ellipse cx="18" cy="22" rx="9" ry="5" fill="#FFF2D6" transform="rotate(-30 18 22)" /><ellipse cx="40" cy="14" rx="9" ry="5" fill="#FFF2D6" transform="rotate(20 40 14)" /><ellipse cx="34" cy="42" rx="9" ry="5" fill="#FFF2D6" transform="rotate(60 34 42)" /></svg>
        </div>
      </div>
      <button type="button" className="hero__bajar" onClick={() => scrollToTarget('#anatomia')} aria-label="Bajar"><span /></button>
    </section>
  );
}
