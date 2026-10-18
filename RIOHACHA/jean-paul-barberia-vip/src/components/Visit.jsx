import { useEffect, useRef, useState } from 'react';
import { Logo, WaIcon } from './Brand';
import { CONFIG, HOURS } from '../data';
import { DAYS, bogotaNow, fmtMin, openNow } from '../lib/hours';
import { scrollToTarget } from '../lib/scroll';

export function Visit() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(false);
  const [open, setOpen] = useState(openNow);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMap(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(mapRef.current);
    const id = setInterval(() => setOpen(openNow()), 60000);
    return () => { io.disconnect(); clearInterval(id); };
  }, []);
  const today = bogotaNow().day;
  return (
    <section id="visitanos" className="visit-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="sec-head">
          <div>
            <p className="eyebrow"><span className="dot" /> Visítanos</p>
            <h2 className="rv mask-up sec-title"><span>Te esperamos en <em>Riohacha</em></span></h2>
          </div>
          <span className={`open ${open ? 'on' : ''}`}><i />{open ? `Abierto ahora · hasta las ${fmtMin(open)}` : 'Cerrado en este momento'}</span>
        </div>
        <div className="visit-grid">
          <div ref={mapRef} className="map">
            {map ? <iframe title="Ubicación de Jean Paul Barbería VIP" src={CONFIG.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="map-ph" />}
            <a className="map-card" href={CONFIG.maps} target="_blank" rel="noopener noreferrer"><b>{CONFIG.address}</b><span>{CONFIG.city}</span><em>Cómo llegar →</em></a>
          </div>
          <div className="visit-side">
            <div className="vcard">
              <h3>Horario</h3>
              <ul className="hours">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => <li key={d} className={d === today ? 'today' : ''}><span>{DAYS[d]}</span><span>{HOURS[d] ? `${fmtMin(HOURS[d][0])} – ${fmtMin(HOURS[d][1])}` : 'Cerrado'}</span></li>)}
              </ul>
            </div>
            <div className="vcard">
              <h3>Métodos de pago</h3>
              <div className="pays">{CONFIG.payments.map((p) => <span key={p}>{p}</span>)}</div>
            </div>
            <a className="btn btn-wa w-full" href={CONFIG.phone ? `https://wa.me/${CONFIG.phone}` : CONFIG.waMessage} target="_blank" rel="noopener noreferrer"><WaIcon /> Escríbenos por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap flex flex-col items-center py-16 text-center">
        <div className="foot-logo"><Logo /></div>
        <p className="foot-motto">Elegancia para grandes, cariño para pequeños</p>
        <p className="mt-3 text-[14px] text-white/50">{CONFIG.address} · {CONFIG.city}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="btn btn-line" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a className="btn btn-line" href={CONFIG.phone ? `https://wa.me/${CONFIG.phone}` : CONFIG.waMessage} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
        <p className="mt-10 text-[12px] text-white/30">© {new Date().getFullYear()} Jean Paul Barbería VIP</p>
      </div>
    </footer>
  );
}

export function FloatWA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.8);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return <a href="#agenda" onClick={(e) => { e.preventDefault(); scrollToTarget('#agenda'); }} className={`float-cta ${show ? 'on' : ''}`} aria-label="Agendar cita"><span className="fc-ic">✂</span><span className="fc-t">Agendar cita</span></a>;
}
