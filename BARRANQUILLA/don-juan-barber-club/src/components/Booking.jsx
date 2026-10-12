import { useEffect, useMemo, useState } from 'react';
import Photo from './Photo';
import { Fleur, NeonLogo } from './Brand';
import { COURTESY, SEDES, SERVICES, TEAM, fmt, waLink } from '../data';
import { DAYS, bogotaNow, fmtMin } from '../lib/hours';

const STEPS = ['Sede', 'Servicios', 'Barbero', 'Fecha y hora', 'Tus datos'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/**
 * Reserva en 5 pasos con un ticket VIP que se arma en vivo a un lado.
 * Cada paso entra girando en 3D. Al final la reserva se envía por WhatsApp con todos los detalles.
 */
export default function Booking({ preset }) {
  const [step, setStep] = useState(0);
  const [sede, setSede] = useState(null);
  const [who, setWho] = useState('el');
  const [svcs, setSvcs] = useState([]);
  const [pro, setPro] = useState(TEAM[0].id);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [drink, setDrink] = useState(COURTESY[0]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!preset) return;
    setWho(preset.who);
    setSvcs((s) => (s.includes(preset.id) ? s : [...s, preset.id]));
    setStep((st) => (sede ? Math.max(st, 1) : 0));
  }, [preset]); // eslint-disable-line react-hooks/exhaustive-deps

  const all = [...SERVICES.el, ...SERVICES.ella];
  const chosen = svcs.map((id) => all.find((s) => s.id === id)).filter(Boolean);
  const total = chosen.reduce((n, s) => n + s.price, 0);
  const mins = chosen.reduce((n, s) => n + s.min, 0);
  const S = SEDES.find((x) => x.id === sede);

  const days = useMemo(() => {
    const now = bogotaNow();
    const [y, m, d] = now.ymd.split('-').map(Number);
    return Array.from({ length: 14 }, (_, i) => { const dt = new Date(y, m - 1, d + i, 12); return { key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`, dow: dt.getDay(), d: dt.getDate(), m: dt.getMonth(), today: i === 0 }; });
  }, []);
  const slots = useMemo(() => {
    if (!S || !date) return [];
    const dd = days.find((x) => x.key === date);
    const h = S.hours[dd.dow];
    if (!h) return [];
    const now = bogotaNow();
    const out = [];
    for (let t = h[0]; t + Math.max(mins, 30) <= h[1]; t += 30) if (!dd.today || t > now.min + 30) out.push(t);
    return out;
  }, [S, date, days, mins]);

  const can = [!!sede, chosen.length > 0, !!pro, !!date && time !== null, name.trim().length > 1][step];
  const next = () => { if (can) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };
  const toggle = (id) => setSvcs((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const dd = days.find((x) => x.key === date);
  const P = TEAM.find((x) => x.id === pro);
  const send = () => {
    const msg = `¡Hola Don Juan Barber Club! ⚜ Quiero reservar:\n\n📍 Sede: ${S.n}\n✂️ Servicios: ${chosen.map((s) => s.n).join(', ')}\n💈 Profesional: ${P.n}\n📅 ${DAYS[dd.dow]} ${dd.d} de ${MONTHS[dd.m]} · ${fmtMin(time)}\n⏱ Duración aprox.: ${mins} min\n💰 Total aprox.: ${fmt.format(total)}\n🍺 Bebida de cortesía: ${drink}\n👤 A nombre de: ${name.trim()}${note.trim() ? `\n📝 ${note.trim()}` : ''}`;
    window.open(waLink(msg), '_blank', 'noopener');
    setSent(true);
  };

  return (
    <section id="reservar" className="book-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="text-center">
          <p className="kicker justify-center">Reservas</p>
          <h2 className="rv mask-up sec-title"><span>Aparta tu <span className="gold-text">silla</span></span></h2>
          <p className="rv mx-auto mt-3 max-w-[48ch] text-white/65">En menos de un minuto. Te confirmamos por WhatsApp.</p>
        </div>
        <ol className="stepper" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step}><span>{i < step ? '✓' : i + 1}</span><em>{s}</em></button>
            </li>
          ))}
          <i className="st-line" style={{ '--p': step / (STEPS.length - 1) }} />
        </ol>
        <div className="book-grid">
          <div className="book-stage">
            <div key={step} className="bpanel">
              {step === 0 && (
                <div className="opt-grid three">
                  {SEDES.map((x) => (
                    <button key={x.id} type="button" className={`opt sede ${sede === x.id ? 'on' : ''}`} onClick={() => { setSede(x.id); setTimeout(() => setStep(1), 260); }}>
                      <Photo src={x.img} alt={x.n} w={600} />
                      <span className="opt-in"><em>{x.tag}</em><b>{x.n}</b><small>{x.d}</small></span>
                    </button>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div>
                  <div className="switch small" role="tablist">
                    <button type="button" className={who === 'el' ? 'on' : ''} onClick={() => setWho('el')}>Él</button>
                    <button type="button" className={who === 'ella' ? 'on' : ''} onClick={() => setWho('ella')}>Ella</button>
                    <i className={`sw-knob ${who}`} />
                  </div>
                  <div className="opt-list">
                    {SERVICES[who].map((s) => (
                      <button key={s.id} type="button" className={`opt row ${svcs.includes(s.id) ? 'on' : ''}`} onClick={() => toggle(s.id)} aria-pressed={svcs.includes(s.id)}>
                        <span className="check" aria-hidden="true">{svcs.includes(s.id) ? '✓' : '+'}</span>
                        <span className="row-t"><b>{s.n}</b><small>{s.min} min</small></span>
                        <em>{fmt.format(s.price)}</em>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="opt-grid pros">
                  {TEAM.map((x) => (
                    <button key={x.id} type="button" className={`opt pro ${pro === x.id ? 'on' : ''}`} onClick={() => setPro(x.id)}>
                      <Photo src={x.img} alt={x.n} w={400} />
                      <span className="opt-in"><b>{x.n}</b><small>{x.r}</small></span>
                    </button>
                  ))}
                </div>
              )}
              {step === 3 && (
                <div>
                  <div className="days no-scrollbar">
                    {days.map((x) => {
                      const closed = !S.hours[x.dow];
                      return (
                        <button key={x.key} type="button" disabled={closed} className={`day ${date === x.key ? 'on' : ''}`} onClick={() => { setDate(x.key); setTime(null); }}>
                          <small>{x.today ? 'Hoy' : DAYS[x.dow].slice(0, 3)}</small><b>{x.d}</b><small>{MONTHS[x.m]}</small>
                        </button>
                      );
                    })}
                  </div>
                  {date ? (
                    slots.length ? (
                      <div className="slots">{slots.map((t) => <button key={t} type="button" className={time === t ? 'on' : ''} onClick={() => setTime(t)}>{fmtMin(t)}</button>)}</div>
                    ) : <p className="empty-slots">No quedan horarios este día. Elige otro 💈</p>
                  ) : <p className="empty-slots">Elige un día para ver los horarios disponibles.</p>}
                </div>
              )}
              {step === 4 && (
                <div className="form">
                  <div className="fld"><label htmlFor="bn">¿A nombre de quién?</label><input id="bn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" /></div>
                  <div className="fld"><span className="lbl">Tu bebida de cortesía</span><div className="drink-pick">{COURTESY.map((d) => <button key={d} type="button" className={drink === d ? 'on' : ''} onClick={() => setDrink(d)}>{d}</button>)}</div></div>
                  <div className="fld"><label htmlFor="bnote">Algo que debamos saber (opcional)</label><input id="bnote" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej.: traigo foto del corte, es para un evento…" /></div>
                  <button type="button" className="btn btn-gold btn-xl w-full" disabled={!can} onClick={send}>Confirmar por WhatsApp</button>
                  {sent && <p className="sent">¡Listo! Si no se abrió WhatsApp, revisa que tu navegador permita ventanas nuevas.</p>}
                </div>
              )}
            </div>
            <div className="bnav">
              <button type="button" className="btn btn-glass" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>← Atrás</button>
              {step < STEPS.length - 1 && <button type="button" className="btn btn-gold" onClick={next} disabled={!can}>Continuar →</button>}
            </div>
          </div>
          <aside className="ticket" aria-label="Resumen de tu reserva">
            <div className="tk-head"><NeonLogo club={false} /><span>VIP PASS</span></div>
            <dl>
              <div><dt>Sede</dt><dd>{S ? S.n : '—'}</dd></div>
              <div><dt>Servicios</dt><dd>{chosen.length ? chosen.map((s) => s.n).join(' · ') : '—'}</dd></div>
              <div><dt>Profesional</dt><dd>{P.n}</dd></div>
              <div><dt>Cuándo</dt><dd>{dd ? `${DAYS[dd.dow]} ${dd.d} ${MONTHS[dd.m]}${time !== null ? ` · ${fmtMin(time)}` : ''}` : '—'}</dd></div>
              <div><dt>Bebida de cortesía</dt><dd>{step === 4 ? drink : '—'}</dd></div>
              <div><dt>A nombre de</dt><dd>{name || '—'}</dd></div>
            </dl>
            <div className="tk-cut" aria-hidden="true" />
            <div className="tk-total"><span>{mins ? `${mins} min aprox.` : 'Total'}</span><b>{fmt.format(total)}</b></div>
            <p className="tk-gift"><Fleur /> Incluye bebida de cortesía</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
