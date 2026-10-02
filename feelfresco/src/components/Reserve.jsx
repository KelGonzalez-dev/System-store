import { useEffect, useState } from 'react';
import { Badge } from './Mascot';
import { Brand } from './Nav';
import { HOUSES, IG, LINKTREE, TIKTOK, domiLink, sendMessage, useI18n } from '../i18n';
import { scrollToTarget } from '../lib/scroll';

// Reservas gratis: elige casa, día y personas; se envía al WhatsApp de esa casa (o por Instagram)
export function Reserve() {
  const { t, lang } = useI18n();
  const r = t.res;
  const [f, setF] = useState({ c: 0, n: '', d: '', h: '19:00', p: '2' });
  const [note, setNote] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const house = HOUSES[f.c];
  const submit = async (e) => {
    e.preventDefault();
    const people = `${f.p} ${+f.p === 1 ? r.one : r.many}`;
    const res = await sendMessage(r.msg(house.name, f.n, f.d, f.h, people), house.phone);
    if (res === 'ig') { setNote(r.copied); setTimeout(() => setNote(''), 7000); }
  };
  return (
    <section id="reservas" className="res-sec relative overflow-hidden py-[clamp(80px,10vw,130px)]">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="rv mask-up sec-title text-rojo"><span>{r.title}</span></h2>
          <p className="rv mt-5 max-w-[40ch] text-[17px] font-medium leading-relaxed text-vino/80">{r.lead}</p>
          <div className="res-mascot mt-8 hidden lg:block"><Badge className="w-full" /></div>
        </div>
        <form onSubmit={submit} className="res-card">
          <p className="fld-label">{r.house}</p>
          <div className="mt-2 grid grid-cols-2 gap-3" role="radiogroup" aria-label={r.house}>
            {HOUSES.map((h, i) => (
              <button type="button" key={h.id} role="radio" aria-checked={f.c === i} onClick={() => setF({ ...f, c: i })} className={`house-pick ${f.c === i ? 'on' : ''}`}>
                <span aria-hidden="true">🏠</span>{h.name}
              </button>
            ))}
          </div>
          <div className="fld mt-5"><label htmlFor="rn">{r.name}</label><input id="rn" required placeholder={r.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="fld"><label htmlFor="rd">{r.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} lang={lang} /></div>
            <div className="fld"><label htmlFor="rh">{r.time}</label><input id="rh" type="time" required min="18:00" max="23:00" value={f.h} onChange={set('h')} /></div>
          </div>
          <div className="fld mt-4"><label htmlFor="rp">{r.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 16 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? r.many : r.one}</option>)}</select></div>
          <button type="submit" className="btn btn-red mt-7 w-full">{house.phone ? r.send : r.sendIg}</button>
          {note && <p className="mt-3 text-center text-[13px] font-semibold text-vino" role="status">{note}</p>}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot relative overflow-hidden pt-[clamp(70px,9vw,110px)]">
      <div className="wrap relative">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 md:w-40"><Badge spin className="w-full" /></div>
          <p className="foot-word font-display">Feel Fresco</p>
          <p className="font-script text-[clamp(30px,3.6vw,48px)] leading-none text-amarillo">Don’t stress</p>
        </div>
        <div className="mt-14 grid gap-8 border-t border-crema/25 pt-10 text-crema md:grid-cols-3">
          {HOUSES.map((h) => (
            <div key={h.id}>
              <p className="font-display text-[26px] leading-none">{h.name}</p>
              <p className="mt-2 text-[14px] text-crema/80">{h.address}</p>
              <a className="ulink mt-2 inline-block text-[14px] font-bold" href={domiLink(h)} target="_blank" rel="noopener noreferrer">{t.houses.domi} →</a>
            </div>
          ))}
          <div>
            <p className="font-display text-[26px] leading-none">⏰</p>
            <p className="mt-2 text-[14px] text-crema/80">{t.houses.hours}</p>
            <div className="mt-3 flex gap-4 text-[14px] font-bold">
              <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="ulink" href={TIKTOK} target="_blank" rel="noopener noreferrer">TikTok</a>
              <a className="ulink" href={LINKTREE} target="_blank" rel="noopener noreferrer">Linktree</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 py-8 text-[12px] text-crema/60 md:flex-row">
          <Brand small />
          <span>© {new Date().getFullYear()} Feel Fresco · Smash Burger. {t.foot.rights}</span>
          <a href="#inicio" className="ulink" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}

// Botón flotante "Pedir": domicilios de la primera casa (o Linktree con ambas líneas)
export function FloatOrder() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.8);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const anyPhone = HOUSES.find((h) => h.phone);
  return (
    <a href={anyPhone ? domiLink(anyPhone) : LINKTREE} target="_blank" rel="noopener noreferrer" className={`float-order ${show ? 'on' : ''}`}>
      <span aria-hidden="true">🍔</span>{t.nav.order}
    </a>
  );
}
