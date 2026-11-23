import { useRef } from 'react';
import { WaIcon } from './Logo';
import { CONFIG, HORARIO, waLink } from '../data';
import { DIAS, abierto, bogotaAhora, hora } from '../lib/horario';
import { useScrollFrame, scrollToTarget } from '../lib/scroll';

/** Domicilios: la moto recorre la carretera al hacer scroll, pasos para pedir, horario y pagos. */
export default function Domicilio() {
  const sec = useRef(null);
  const moto = useRef(null);
  useScrollFrame(sec, (p) => {
    const k = Math.min(1, Math.max(0, (p - 0.15) / 0.7));
    if (moto.current) moto.current.style.transform = `translate3d(${(k * 100).toFixed(2)}%, 0, 0)`;
    sec.current?.style.setProperty('--k', k.toFixed(3));
  });
  const ab = abierto();
  const hoy = bogotaAhora().dia;
  return (
    <section id="domicilio" ref={sec} className="dom">
      <div className="wrap">
        <div className="dom__head">
          <p className="eyebrow">Servicio a domicilio</p>
          <h2 className="titulo">De nuestra plancha <span className="queso">a tu puerta.</span></h2>
        </div>
        <div className="carretera" aria-hidden="true">
          <span className="carretera__linea" />
          <div className="carretera__pista">
            <div ref={moto} className="moto">
              <svg viewBox="0 0 160 110">
                <circle cx="34" cy="86" r="18" fill="#1A1412" stroke="#FFF4E0" strokeWidth="5" />
                <circle cx="124" cy="86" r="18" fill="#1A1412" stroke="#FFF4E0" strokeWidth="5" />
                <path d="M34 86h44l18-26h28l8 26" stroke="#E1262B" strokeWidth="10" fill="none" strokeLinejoin="round" />
                <rect x="18" y="34" width="44" height="36" rx="6" fill="#E1262B" />
                <text x="40" y="58" textAnchor="middle" fontFamily="Bowlby One, sans-serif" fontSize="16" fill="#FFC531">88</text>
                <circle cx="92" cy="22" r="11" fill="#FFC531" />
                <path d="M84 34l-6 24h22l12-12" stroke="#FFF4E0" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M112 50l12-14" stroke="#FFF4E0" strokeWidth="6" strokeLinecap="round" />
              </svg>
              <span className="moto__humo" />
            </div>
          </div>
          <svg className="carretera__casa" viewBox="0 0 60 56"><path d="M6 26L30 6l24 20v26H6z" fill="#FFF4E0" /><path d="M2 28L30 4l28 24" stroke="#E1262B" strokeWidth="6" fill="none" strokeLinecap="round" /><rect x="24" y="34" width="12" height="18" rx="2" fill="#E1262B" /></svg>
        </div>
        <ol className="pasos">
          <li><b>1</b><div><h3>Elige en el menú</h3><p>Toca los platos que quieras y agrégales lo que se te antoje.</p></div></li>
          <li><b>2</b><div><h3>Arma tu pedido</h3><p>Escribe tu dirección y cómo vas a pagar.</p></div></li>
          <li><b>3</b><div><h3>Envíalo por WhatsApp</h3><p>Te confirmamos y sale caliente para tu casa.</p></div></li>
        </ol>
        <div className="dom__grid">
          <div className="caja">
            <h3>Horario <span className={`estado ${ab.abierto ? 'on' : ''}`}>{ab.abierto ? 'Abierto' : 'Cerrado'}</span></h3>
            <ul className="horas">
              {[1, 2, 3, 4, 5, 6, 0].map((dd) => <li key={dd} className={dd === hoy ? 'hoy' : ''}><span>{DIAS[dd]}</span><span>{HORARIO[dd] ? `${hora(HORARIO[dd][0])} – ${hora(HORARIO[dd][1])}` : 'Cerrado'}</span></li>)}
            </ul>
          </div>
          <div className="caja">
            <h3>Pagas como quieras</h3>
            <div className="chips">{CONFIG.pagos.map((p) => <span key={p}>{p}</span>)}</div>
            <h3 className="caja__t2">¿Dónde estamos?</h3>
            <p className="caja__p">{CONFIG.direccion || `${CONFIG.ciudad}, Norte de Santander`} · Domicilios a toda la ciudad.</p>
            <div className="caja__cta">
              <button type="button" className="btn btn--queso" onClick={() => scrollToTarget('#menu')}>Armar mi pedido</button>
              <a className="btn btn--wa" href={waLink('¡Hola 88 Burger! 🍔 Quiero hacer un pedido.')} target="_blank" rel="noopener noreferrer"><WaIcon /> WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
