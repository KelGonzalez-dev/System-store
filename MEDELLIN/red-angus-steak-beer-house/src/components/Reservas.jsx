import { useState } from 'react';
import { CONFIG, SEDES, waLink } from '../data';
import { DIAS, bogota, estado, hora } from '../lib/horario';

const HORAS = ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00'];

/** Reservas: información de las sedes y formulario clásico. */
export default function Reservas() {
  const { hoy } = bogota();
  const [r, setR] = useState({ sede: SEDES[0].id, fecha: hoy, hora: '13:00', personas: 2, nombre: '', telefono: '', notas: '' });
  const [copiado, setCopiado] = useState(false);
  const S = SEDES.find((s) => s.id === r.sede);
  const fechaTxt = (() => { const [y, m, d] = r.fecha.split('-').map(Number); return `${DIAS[new Date(y, m - 1, d).getDay()]} ${d}/${m}/${y}`; })();
  const msg = `Buen día, Red Angus. Deseo hacer una reservación:\n\nSede: ${S.nombre}\nFecha: ${fechaTxt}\nHora: ${r.hora}\nPersonas: ${r.personas}\nA nombre de: ${r.nombre}${r.telefono ? `\nTeléfono: ${r.telefono}` : ''}${r.notas ? `\nObservaciones: ${r.notas}` : ''}\n\nMuchas gracias.`;
  const enviar = async (e) => {
    e.preventDefault();
    if (CONFIG.whatsapp) { window.open(waLink(msg), '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(msg); setCopiado(true); } catch { /* sin portapapeles */ }
    window.open(CONFIG.reservas, '_blank', 'noopener');
  };
  const set = (k) => (e) => setR({ ...r, [k]: e.target.value });
  return (
    <section id="reservas" className="reservas">
      <div className="wrap reservas__grid">
        <div className="rv">
          <p className="sobre">Reservaciones</p>
          <h2 className="titulo">Lo esperamos <em>en nuestra mesa.</em></h2>
          <span className="filete" />
          <div className="sedes">
            {SEDES.map((s) => {
              const e = estado(s.horario);
              return (
                <div key={s.id} className="sede">
                  <h3>{s.nombre} <small>{s.tipo}</small></h3>
                  <p>{s.direccion}</p>
                  <p className={`sede__estado ${e.abierto ? 'on' : ''}`}>{e.texto}</p>
                  <dl>{[1, 2, 3, 4, 5, 6, 0].map((d) => <div key={d}><dt>{DIAS[d]}</dt><dd>{s.horario[d] ? `${hora(s.horario[d][0])} – ${hora(s.horario[d][1])}` : 'Cerrado'}</dd></div>)}</dl>
                </div>
              );
            })}
          </div>
        </div>
        <form className="form rv" onSubmit={enviar}>
          <h3>Solicitar reserva</h3>
          <div className="form__fila">
            <label><span>Sede</span><select value={r.sede} onChange={set('sede')}>{SEDES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select></label>
            <label><span>Personas</span><select value={r.personas} onChange={(e) => setR({ ...r, personas: Number(e.target.value) })}>{Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>
          </div>
          <div className="form__fila">
            <label><span>Fecha</span><input type="date" min={hoy} value={r.fecha} onChange={set('fecha')} required /></label>
            <label><span>Hora</span><select value={r.hora} onChange={set('hora')}>{HORAS.map((h) => <option key={h}>{h}</option>)}</select></label>
          </div>
          <label><span>Nombre completo</span><input value={r.nombre} onChange={set('nombre')} required minLength={3} autoComplete="name" /></label>
          <label><span>Teléfono</span><input type="tel" value={r.telefono} onChange={set('telefono')} autoComplete="tel" /></label>
          <label><span>Observaciones</span><textarea rows={3} value={r.notas} onChange={set('notas')} placeholder="Celebración, preferencia de mesa, silla para niños…" /></label>
          <button type="submit" className="btn btn--rojo form__btn">Solicitar reserva</button>
          {copiado && <p className="form__ok">Hemos copiado los datos de su reserva. Péguelos en la página de reservas que se abrió.</p>}
        </form>
      </div>
    </section>
  );
}
