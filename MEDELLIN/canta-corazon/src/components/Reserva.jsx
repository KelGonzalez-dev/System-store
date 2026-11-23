import { useState } from 'react';
import { WaIcon } from './Logo';
import { CONFIG, HORARIO, waLink } from '../data';
import { DIAS, abierto, bogota, hora } from '../lib/horario';

const OCASIONES = ['Parche', 'Despedida', 'Cumpleaños', 'Cita', 'Empresa'];

/** Reservas (fecha, personas, ocasión) + ubicación con mapa que carga al tocarlo + horario. */
export default function Reserva() {
  const { hoy, dia } = bogota();
  const [r, setR] = useState({ fecha: hoy, personas: 4, ocasion: 'Parche', nombre: '', notas: '' });
  const [mapa, setMapa] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const ab = abierto();
  const fechaTxt = (() => { const [y, m, d] = r.fecha.split('-').map(Number); const dt = new Date(y, m - 1, d); return `${DIAS[dt.getDay()]} ${d}/${m}`; })();
  const msg = `¡Hola Canta Corazón! 🤠❤️ Quiero reservar:\n\n📅 ${fechaTxt}\n👥 ${r.personas} personas\n🎉 ${r.ocasion}\n🙋 A nombre de: ${r.nombre}${r.notas ? `\n📝 ${r.notas}` : ''}`;
  const enviar = async (e) => {
    e.preventDefault();
    if (CONFIG.whatsapp) { window.open(waLink(msg), '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(msg); setCopiado(true); } catch { /* sin portapapeles */ }
    window.open(`https://ig.me/m/${CONFIG.instagram}`, '_blank', 'noopener');
  };
  return (
    <section id="reserva" className="reserva">
      <div className="wrap reserva__grid">
        <form className="boleto rv" onSubmit={enviar}>
          <div className="boleto__cab"><span>ADMIT ONE</span><b>Reserva</b><span>♥ N.º 0{r.personas}</span></div>
          <label className="campo"><span>¿Qué día?</span><input type="date" min={hoy} value={r.fecha} onChange={(e) => setR({ ...r, fecha: e.target.value })} required /></label>
          <div className="campo"><span>¿Cuántos son?</span>
            <div className="contador"><button type="button" onClick={() => setR({ ...r, personas: Math.max(1, r.personas - 1) })} aria-label="Menos">−</button><b>{r.personas}</b><button type="button" onClick={() => setR({ ...r, personas: Math.min(40, r.personas + 1) })} aria-label="Más">+</button></div>
          </div>
          <div className="campo"><span>¿Qué celebran?</span><div className="chips">{OCASIONES.map((o) => <button key={o} type="button" className={r.ocasion === o ? 'on' : ''} onClick={() => setR({ ...r, ocasion: o })}>{o}</button>)}</div></div>
          <label className="campo"><span>A nombre de</span><input value={r.nombre} onChange={(e) => setR({ ...r, nombre: e.target.value })} placeholder="Tu nombre" required minLength={2} autoComplete="name" /></label>
          <label className="campo"><span>Algo más (opcional)</span><input value={r.notas} onChange={(e) => setR({ ...r, notas: e.target.value })} placeholder="Ej.: es la despedida de Laura 💍" /></label>
          <button type="submit" className="btn btn--coral boleto__btn">{CONFIG.whatsapp ? <><WaIcon /> Reservar por WhatsApp</> : 'Reservar mesa'}</button>
          {copiado && <p className="boleto__ok">Copiamos tu reserva: pégala en el chat de Instagram que se abrió.</p>}
          <span className="boleto__corte" aria-hidden="true" />
        </form>
        <div className="rv">
          <p className="eyebrow">Reservas & ubicación</p>
          <h2 className="titulo">Te guardamos <em>la mesa.</em></h2>
          <p className="reserva__dir">{CONFIG.direccion}</p>
          <p className={`reserva__estado ${ab.abierto ? 'on' : ''}`}><span className="dot" />{ab.texto}</p>
          <div className="mapa">
            {mapa ? (
              <iframe title="Mapa de Canta Corazón" src={`https://www.google.com/maps?q=${encodeURIComponent(CONFIG.direccion)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <button type="button" className="mapa__btn" onClick={() => setMapa(true)}><span>📍</span>Ver en el mapa</button>
            )}
          </div>
          <ul className="horas">
            {[3, 4, 5, 6, 0, 1, 2].map((d) => <li key={d} className={d === dia ? 'hoy' : ''}><span>{DIAS[d]}</span><span>{HORARIO[d] ? `${hora(HORARIO[d][0])} – ${hora(HORARIO[d][1])}` : 'Cerrado'}</span></li>)}
          </ul>
          <a className="reserva__como" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.direccion)}`} target="_blank" rel="noopener noreferrer">Cómo llegar →</a>
        </div>
      </div>
    </section>
  );
}
