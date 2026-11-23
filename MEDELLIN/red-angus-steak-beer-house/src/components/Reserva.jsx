import { useState } from 'react';
import { WaIcon } from './Logo';
import { CONFIG, SEDES, waLink } from '../data';
import { DIAS, bogota, estado, hora } from '../lib/horario';

const HORAS = ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00'];
const OCASIONES = ['Cena', 'Cumpleaños', 'Aniversario', 'Negocios', 'Evento'];

/** Reservas: el cliente elige sede, fecha, hora, personas y ocasión; se envía por WhatsApp o por su enlace de reservas. */
export default function Reserva() {
  const { hoy } = bogota();
  const [r, setR] = useState({ sede: SEDES[0].id, fecha: hoy, hora: '20:00', personas: 2, ocasion: 'Cena', nombre: '', notas: '' });
  const [copiado, setCopiado] = useState(false);
  const S = SEDES.find((s) => s.id === r.sede);
  const fechaTxt = (() => { const [y, m, d] = r.fecha.split('-').map(Number); const dt = new Date(y, m - 1, d); return `${DIAS[dt.getDay()]} ${d}/${m}`; })();
  const msg = `¡Hola Red Angus! 🥩 Quiero reservar:\n\n📍 Sede ${S.nombre}\n📅 ${fechaTxt} a las ${r.hora}\n👥 ${r.personas} ${r.personas === 1 ? 'persona' : 'personas'}\n🎉 Ocasión: ${r.ocasion}\n🙋 A nombre de: ${r.nombre}${r.notas ? `\n📝 ${r.notas}` : ''}`;
  const enviar = async () => {
    if (CONFIG.whatsapp) { window.open(waLink(msg), '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(msg); setCopiado(true); } catch { /* sin portapapeles */ }
    window.open(CONFIG.reservas, '_blank', 'noopener');
  };
  return (
    <section id="reserva" className="reserva">
      <div className="wrap reserva__grid">
        <div className="rv">
          <p className="eyebrow">Reservas</p>
          <h2 className="titulo">Tu mesa <em>te espera.</em></h2>
          <p className="sec-lead">Cumpleaños, aniversarios, cenas de negocios o simplemente un buen corte con amigos. Reserva en un minuto.</p>
          <div className="sedes">
            {SEDES.map((s) => {
              const e = estado(s.horario);
              return (
                <article key={s.id} className="sede">
                  <div className="sede__top"><b>{s.nombre}</b><span className={`sede__estado ${e.abierto ? 'on' : ''}`}>{e.abierto ? 'Abierto' : 'Cerrado'}</span></div>
                  <span className="sede__tipo">{s.tipo} · {s.nota}</span>
                  <p>{s.direccion || `${s.nombre} · Dirección por confirmar`}</p>
                  <small>{e.texto}</small>
                  <ul>{[1, 2, 3, 4, 5, 6, 0].map((d) => <li key={d}><span>{DIAS[d].slice(0, 3)}</span><span>{s.horario[d] ? `${hora(s.horario[d][0])} – ${hora(s.horario[d][1])}` : 'Cerrado'}</span></li>)}</ul>
                </article>
              );
            })}
          </div>
        </div>
        <form className="ficha" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
          <span className="ficha__sello">RESERVA</span>
          <label className="campo"><span>Sede</span>
            <div className="chips">{SEDES.map((s) => <button key={s.id} type="button" className={r.sede === s.id ? 'on' : ''} onClick={() => setR({ ...r, sede: s.id })}>{s.nombre}</button>)}</div>
          </label>
          <div className="ficha__fila">
            <label className="campo"><span>Fecha</span><input type="date" min={hoy} value={r.fecha} onChange={(e) => setR({ ...r, fecha: e.target.value })} required /></label>
            <label className="campo"><span>Personas</span>
              <div className="contador"><button type="button" onClick={() => setR({ ...r, personas: Math.max(1, r.personas - 1) })} aria-label="Menos">−</button><b>{r.personas}</b><button type="button" onClick={() => setR({ ...r, personas: Math.min(40, r.personas + 1) })} aria-label="Más">+</button></div>
            </label>
          </div>
          <label className="campo"><span>Hora</span><div className="chips">{HORAS.map((h) => <button key={h} type="button" className={r.hora === h ? 'on' : ''} onClick={() => setR({ ...r, hora: h })}>{h}</button>)}</div></label>
          <label className="campo"><span>Ocasión</span><div className="chips">{OCASIONES.map((o) => <button key={o} type="button" className={r.ocasion === o ? 'on' : ''} onClick={() => setR({ ...r, ocasion: o })}>{o}</button>)}</div></label>
          <label className="campo"><span>A nombre de</span><input value={r.nombre} onChange={(e) => setR({ ...r, nombre: e.target.value })} placeholder="Tu nombre" required minLength={2} autoComplete="name" /></label>
          <label className="campo"><span>Notas (opcional)</span><input value={r.notas} onChange={(e) => setR({ ...r, notas: e.target.value })} placeholder="Ej.: mesa en terraza, silla para bebé…" /></label>
          <button type="submit" className="btn btn--rojo ficha__btn">{CONFIG.whatsapp ? <><WaIcon /> Reservar por WhatsApp</> : 'Reservar mesa'}</button>
          {copiado && <p className="ficha__ok">Copiamos los datos de tu reserva: pégalos en el chat que se abrió.</p>}
        </form>
      </div>
    </section>
  );
}
