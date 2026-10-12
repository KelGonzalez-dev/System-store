import { useRef } from 'react';
import Photo from './Photo';
import { Fleur, NeonLogo } from './Brand';
import { CONFIG, SEDES, waLink } from '../data';
import { DAYS, bogotaNow, fmtMin, isOpen } from '../lib/hours';
import { scrollToTarget, useTilt } from '../lib/scroll';

function Sede({ s, i }) {
  const ref = useRef(null);
  useTilt(ref, 7);
  const open = isOpen(s.hours);
  const today = s.hours[bogotaNow().day];
  return (
    <article ref={ref} className="sede-card" style={{ '--k': i }}>
      <div className="sc-photo"><Photo src={s.img} alt={s.n} w={800} /><span className={`sc-open ${open ? 'on' : ''}`}><i />{open ? 'Abierto ahora' : 'Cerrado ahora'}</span></div>
      <div className="sc-body">
        <em>{s.tag}</em>
        <h3>{s.n}</h3>
        <p>{s.d}</p>
        <p className="sc-h">Hoy: {today ? `${fmtMin(today[0])} – ${fmtMin(today[1])}` : 'cerrado'}</p>
        <div className="sc-actions">
          <a className="btn btn-glass !h-11" href={s.maps} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
          <a className="btn btn-gold !h-11" href="#reservar" onClick={(e) => { e.preventDefault(); scrollToTarget('#reservar'); }}>Reservar</a>
        </div>
      </div>
    </article>
  );
}

export function Sedes() {
  const h = SEDES[0].hours;
  return (
    <section id="sedes" className="sedes-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="text-center">
          <p className="kicker justify-center">Sedes en Barranquilla</p>
          <h2 className="rv mask-up sec-title"><span>Tres casas, un <span className="gold-text">club</span></span></h2>
        </div>
        <div className="sedes-grid">{SEDES.map((s, i) => <Sede key={s.id} s={s} i={i} />)}</div>
        <div className="hours-strip">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => <div key={d} className={d === bogotaNow().day ? 'today' : ''}><b>{DAYS[d].slice(0, 3)}</b><span>{h[d] ? `${fmtMin(h[d][0])} – ${fmtMin(h[d][1])}` : 'Cerrado'}</span></div>)}
        </div>
        <div className="domicilio">
          <div><b>Atención exclusiva a domicilio</b><span>Llevamos el club a tu casa, hotel o evento.</span></div>
          <a className="btn btn-gold" href={waLink('¡Hola Don Juan Barber Club! ⚜ Quiero información de la atención exclusiva a domicilio.')} target="_blank" rel="noopener noreferrer">Solicitar</a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap flex flex-col items-center py-16 text-center">
        <div className="w-[min(380px,80vw)]"><NeonLogo /></div>
        <p className="mt-4 text-[13px] uppercase tracking-[0.35em] text-white/55"><Fleur /> La barbería de los famosos <Fleur /></p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="btn btn-gold" href={waLink('¡Hola Don Juan Barber Club! ⚜ Quiero información.')} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="btn btn-glass" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a>
        </div>
        <p className="mt-10 text-[12px] text-white/35">© {new Date().getFullYear()} Don Juan Barber Club · Barranquilla, Colombia</p>
      </div>
    </footer>
  );
}

export function FloatBook() {
  return <a href="#reservar" onClick={(e) => { e.preventDefault(); scrollToTarget('#reservar'); }} className="float-book" aria-label="Reservar"><span>✂</span>Reservar</a>;
}
