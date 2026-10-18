import { useEffect, useRef, useState } from 'react';
import { Logo, WaIcon } from './Brand';
import { CONFIG, HOURS, waLink } from '../data';
import { DAYS, bogotaNow, fmtMin, status } from '../lib/hours';
import { scrollToTarget } from '../lib/scroll';

export function Contact() {
  const ref = useRef(null);
  const [map, setMap] = useState(false);
  const st = status();
  const today = bogotaNow().day;
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMap(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section id="contacto" className="sec contact-sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker">Contacto</p><h2 className="sec-title">Aquí te esperamos</h2></div>
          <span className={`st ${st.open ? 'on' : ''}`}><i />{st.text}</span>
        </div>
        <div className="contact-grid">
          <div ref={ref} className="map">
            {map ? <iframe title="Ubicación de Materiales El Descuento" src={CONFIG.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="map-ph" />}
          </div>
          <div className="contact-side">
            <div className="cbox"><b>Dirección</b><p>{CONFIG.address}<br />{CONFIG.city}</p><a href={CONFIG.maps} target="_blank" rel="noopener noreferrer">Cómo llegar →</a></div>
            <div className="cbox"><b>Horario</b>
              <ul className="hours">{[1, 2, 3, 4, 5, 6, 0].map((d) => <li key={d} className={d === today ? 'today' : ''}><span>{DAYS[d]}</span><span>{HOURS[d] ? `${fmtMin(HOURS[d][0])} – ${fmtMin(HOURS[d][1])}` : 'Cerrado'}</span></li>)}</ul>
            </div>
            <a className="btn btn-wa w-full" href={waLink('¡Hola! Quiero hacer un pedido / consulta.')} target="_blank" rel="noopener noreferrer"><WaIcon /> Pedidos y consultas: 318 400 9867</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ onCat }) {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div><Logo /><p className="mt-4 max-w-[34ch] text-[14px] text-white/60">Tu aliado para la construcción. Más de {CONFIG.years} años en Riohacha.</p></div>
        <div><b>Categorías</b><ul>{['cementos', 'pegas', 'acero', 'obra-gris', 'plomeria', 'electricos'].map((c) => <li key={c}><button type="button" onClick={() => onCat(c)}>{c === 'obra-gris' ? 'Bloques y agregados' : c === 'pegas' ? 'Morteros y pegas' : c === 'acero' ? 'Hierro y acero' : c === 'plomeria' ? 'Plomería y PVC' : c[0].toUpperCase() + c.slice(1)}</button></li>)}</ul></div>
        <div><b>Visítanos</b><p>{CONFIG.address}<br />{CONFIG.city}</p><p className="mt-2">Lun, Mié, Jue 7 a. m.–5 p. m.<br />Mar, Vie 7 a. m.–4 p. m.<br />Sáb 8 a. m.–12 m.</p></div>
        <div><b>Pedidos</b><p><a href={waLink('¡Hola!')} target="_blank" rel="noopener noreferrer">WhatsApp 318 400 9867</a></p><p><a href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a></p></div>
      </div>
      <div className="wrap foot-bottom"><span>© {new Date().getFullYear()} {CONFIG.legal}</span><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>Volver arriba ↑</a></div>
    </footer>
  );
}
