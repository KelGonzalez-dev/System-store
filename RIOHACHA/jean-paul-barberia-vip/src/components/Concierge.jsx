import { useEffect, useMemo, useRef, useState } from 'react';
import { Logo, WaIcon } from './Brand';
import { BARBERS, EXPERIENCES, SERVICES, fmt, sendWhatsApp } from '../data';
import { DAYS, MONTHS, dayLabel, fmtMin, nextDays, slotsFor } from '../lib/hours';

const KEYS = ['svcs', 'who', 'barber', 'day', 'time', 'name'];
const QUESTIONS = [
  '¡Hola! Soy tu concierge en Jean Paul ✨ ¿Qué te vamos a hacer?',
  '¿Para quién es la cita?',
  '¿Tienes barbero de preferencia?',
  '¿Qué día te queda bien?',
  'Perfecto. ¿A qué hora te esperamos?',
  'Por último, ¿a nombre de quién la agendo?',
];
const empty = { svcs: [], who: null, barber: null, day: null, time: null, name: '' };

/**
 * Agenda con concierge: la reserva es una conversación. El concierge pregunta, tú tocas las opciones,
 * y al final ves el ticket de tu cita y la confirmas por WhatsApp. Puedes cambiar cualquier respuesta.
 */
export default function Concierge({ preset }) {
  const [a, setA] = useState(empty);
  const [draft, setDraft] = useState([]);
  const [name, setName] = useState('');
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState(null);
  const box = useRef(null);
  const days = useMemo(() => nextDays(10), []);

  useEffect(() => {
    if (!preset) return;
    const svc = preset.service || SERVICES.find((s) => s.cat === preset.cat)?.id;
    setA({ ...empty, svcs: svc ? [svc] : [], who: preset.cat === 'ninos' ? 'Un pequeño' : null, day: preset.day || null });
    setDraft(svc ? [svc] : []);
    setStatus(null);
  }, [preset]);

  const step = KEYS.findIndex((k) => (k === 'svcs' ? a.svcs.length === 0 : !a[k]));
  const done = step === -1;
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 650);
    return () => clearTimeout(t);
  }, [step]);
  useEffect(() => { const el = box.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, [step, typing, status]);

  const chosen = a.svcs.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean);
  const mins = chosen.reduce((n, s) => n + s.min, 0) || 45;
  const total = chosen.reduce((n, s) => n + s.price, 0);
  const D = days.find((x) => x.key === a.day);
  const answer = (k, v) => setA((s) => ({ ...s, [k]: v }));
  const edit = (i) => { setStatus(null); setA((s) => { const n = { ...s }; KEYS.slice(i).forEach((k) => { n[k] = k === 'svcs' ? [] : k === 'name' ? '' : null; }); return n; }); if (i === 0) setDraft(a.svcs); };
  const label = (k) => {
    if (k === 'svcs') return chosen.map((s) => s.n).join(' + ');
    if (k === 'day') return D ? `${dayLabel(D)}, ${D.d} de ${MONTHS[D.m]}` : '';
    if (k === 'time') return fmtMin(a.time);
    return a[k];
  };
  const confirm = async () => {
    const text = `¡Hola Jean Paul Barbería VIP! ✨ Quiero agendar:\n\n✂️ ${chosen.map((s) => s.n).join(' + ')}\n👤 Para: ${a.who}\n💈 Barbero: ${a.barber}\n📅 ${DAYS[D.dow]} ${D.d} de ${MONTHS[D.m]} · ${fmtMin(a.time)}\n⏱ Aprox. ${mins} min · 💰 ${fmt.format(total)}\n🙋 A nombre de: ${a.name}`;
    setStatus(await sendWhatsApp(text));
  };

  const options = () => {
    if (step === 0) return (
      <div className="opts">
        {EXPERIENCES.map((e) => {
          const list = SERVICES.filter((s) => s.cat === e.id);
          return list.map((s) => (
            <button key={s.id} type="button" className={`chip ${draft.includes(s.id) ? 'on' : ''}`} onClick={() => setDraft((d) => (d.includes(s.id) ? d.filter((x) => x !== s.id) : [...d, s.id]))}>
              {s.n} <small>{fmt.format(s.price)}</small>
            </button>
          ));
        })}
        <button type="button" className="chip go" disabled={!draft.length} onClick={() => answer('svcs', draft)}>Listo →</button>
      </div>
    );
    if (step === 1) return <div className="opts">{['Para mí', 'Un pequeño', 'Otra persona'].map((x) => <button key={x} type="button" className="chip" onClick={() => answer('who', x)}>{x}</button>)}</div>;
    if (step === 2) return <div className="opts">{BARBERS.map((x) => <button key={x} type="button" className="chip" onClick={() => answer('barber', x)}>{x}</button>)}</div>;
    if (step === 3) return <div className="opts">{days.map((x) => <button key={x.key} type="button" className="chip day" onClick={() => answer('day', x.key)}><b>{dayLabel(x)}</b><small>{x.d} {MONTHS[x.m].slice(0, 3)}</small></button>)}</div>;
    if (step === 4) {
      const s = slotsFor(D, mins);
      return s.length
        ? <div className="opts">{s.map((t) => <button key={t} type="button" className="chip" onClick={() => answer('time', t)}>{fmtMin(t)}</button>)}</div>
        : <div className="opts"><p className="no-slots">Ya no quedan horarios ese día.</p><button type="button" className="chip" onClick={() => edit(3)}>Elegir otro día</button></div>;
    }
    if (step === 5) return (
      <form className="opts name" onSubmit={(e) => { e.preventDefault(); if (name.trim().length > 1) answer('name', name.trim()); }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Escribe tu nombre" aria-label="Tu nombre" autoComplete="name" />
        <button type="submit" className="chip go" disabled={name.trim().length < 2}>Enviar</button>
      </form>
    );
    return null;
  };

  return (
    <section id="agenda" className="agenda-sec">
      <div className="wrap agenda-grid py-[clamp(90px,11vw,140px)]">
        <div className="agenda-copy">
          <p className="eyebrow"><span className="dot" /> Agenda tu cita</p>
          <h2 className="rv mask-up sec-title"><span>Tu concierge <em>personal</em></span></h2>
          <p className="rv sec-lead mt-4">Agendar en Jean Paul es tan fácil como conversar. Responde unas preguntas y confirma tu cita por WhatsApp. Sin formularios, sin esperas.</p>
          <ul className="agenda-perks rv">
            <li>⏱ Menos de un minuto</li><li>📅 Horarios según disponibilidad</li><li>💬 Confirmación por WhatsApp</li>
          </ul>
        </div>
        <div className="phone">
          <div className="ph-top"><span className="ph-avatar">JP</span><div><b>Concierge Jean Paul</b><small>{typing ? 'escribiendo…' : 'en línea'}</small></div><Logo sub={false} /></div>
          <div ref={box} className="ph-chat" aria-live="polite">
            {KEYS.map((k, i) => {
              const answered = k === 'svcs' ? a.svcs.length > 0 : !!a[k];
              if (i > (done ? KEYS.length - 1 : step)) return null;
              const isCur = i === step;
              if (isCur && typing) return <div key={k} className="msg bot"><span className="dots"><i /><i /><i /></span></div>;
              return (
                <div key={k} className="pair">
                  <div className="msg bot">{QUESTIONS[i]}</div>
                  {answered && <div className="msg me">{label(k)}<button type="button" className="edit" onClick={() => edit(i)} aria-label="Cambiar respuesta">cambiar</button></div>}
                </div>
              );
            })}
            {done && !typing && (
              <div className="pair">
                <div className="msg bot">¡Listo! Esta es tu cita 👇</div>
                <div className="ticket">
                  <div className="tk-row"><span>Servicio</span><b>{label('svcs')}</b></div>
                  <div className="tk-row"><span>Para</span><b>{a.who}</b></div>
                  <div className="tk-row"><span>Barbero</span><b>{a.barber}</b></div>
                  <div className="tk-row"><span>Cuándo</span><b>{label('day')} · {label('time')}</b></div>
                  <div className="tk-row"><span>A nombre de</span><b>{a.name}</b></div>
                  <div className="tk-total"><span>{mins} min aprox.</span><b>{fmt.format(total)}</b></div>
                  <button type="button" className="btn btn-wa w-full" onClick={confirm}><WaIcon /> Confirmar por WhatsApp</button>
                </div>
                {status === 'copied' && <div className="msg bot">Te abrí nuestro WhatsApp y <b>copié tu cita</b>: solo pégala en el chat y envíala 😉</div>}
                {status === 'sent' && <div className="msg bot">¡Perfecto! Envía el mensaje en WhatsApp y te confirmamos enseguida 🙌</div>}
              </div>
            )}
          </div>
          {!done && !typing && <div className="ph-input">{options()}</div>}
        </div>
      </div>
    </section>
  );
}
