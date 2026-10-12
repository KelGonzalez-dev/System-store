import { useEffect, useState } from 'react';
import Img from './Img';
import { LogoBadge, Wordmark } from './Brand';
import { LOCAL } from '../data';
import { IG, LINKTREE, MAPS, PHONE, sendMessage, useI18n } from '../i18n';
import { scrollToTarget } from '../lib/scroll';
import { status } from '../lib/hours';

const Ico = ({ d }) => <svg viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 fill-none stroke-neon" strokeWidth="1.6" aria-hidden="true"><path d={d} /></svg>;

export function Visit() {
  const { t, lang } = useI18n();
  const v = t.visit;
  const [f, setF] = useState({ n: '', d: '', h: '19:00', p: '2', o: 0 });
  const [note, setNote] = useState('');
  const row = status().row;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const people = `${f.p} ${+f.p === 1 ? v.one : v.many}`;
    const r = await sendMessage(v.msg(f.n, f.d, f.h, people, v.occ[f.o]));
    if (r === 'ig') { setNote(v.copied); setTimeout(() => setNote(''), 7000); }
  };
  return (
    <section id="visitanos" className="relative overflow-hidden bg-noche py-[clamp(80px,10vw,140px)]">
      <div className="checker-strip top" aria-hidden="true" />
      <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,470px)] lg:gap-16">
        <div>
          <h2 className="rv mask-up sec-title text-hueso"><span>{v.title}</span></h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="flex gap-4">
              <Ico d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              <div><p className="info-k">{v.addr}</p><p className="info-v">{v.address}</p><a href={MAPS} target="_blank" rel="noopener noreferrer" className="info-link">{v.map} →</a></div>
            </div>
            <div className="flex gap-4">
              <Ico d="M5 7h14l-1 13H6L5 7zM9 7V5a3 3 0 0 1 6 0v2" />
              <div><p className="info-k">{v.delivery}</p><a href={LINKTREE} target="_blank" rel="noopener noreferrer" className="info-link">{v.deliveryV} →</a></div>
            </div>
            <div className="flex gap-4 sm:col-span-2">
              <Ico d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />
              <div className="flex-1">
                <p className="info-k">{v.hours}</p>
                <dl className="hours">
                  {v.days.map(([d, h], i) => (
                    <div key={d} className={i === row ? 'is-today' : ''}><dt>{d}{i === row && <em>{t.hero.closedToday}</em>}</dt><dd>{h}</dd></div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
          <a href={MAPS} target="_blank" rel="noopener noreferrer" className="visit-map" aria-label={v.map}>
            <Img id={LOCAL.aerea} className="h-full w-full" alt="" />
            <span className="visit-pin"><LogoBadge className="w-14" /></span>
          </a>
        </div>

        <form onSubmit={submit} className="res-card">
          <h3 className="font-display text-[clamp(30px,3vw,40px)] uppercase leading-none text-hueso">{v.formT}</h3>
          <div className="fld mt-7"><label htmlFor="rn">{v.name}</label><input id="rn" required placeholder={v.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="fld"><label htmlFor="rd">{v.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} lang={lang} /></div>
            <div className="fld"><label htmlFor="rh">{v.time}</label><input id="rh" type="time" required value={f.h} onChange={set('h')} /></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="fld"><label htmlFor="rp">{v.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? v.many : v.one}</option>)}</select></div>
            <div className="fld"><label htmlFor="ro">{v.occasion}</label><select id="ro" value={f.o} onChange={set('o')}>{v.occ.map((o, i) => <option key={o} value={i}>{o}</option>)}</select></div>
          </div>
          <button type="submit" className="btn btn-neon mt-7 w-full">{PHONE ? v.send : v.sendIg}</button>
          {note && <p className="mt-3 text-center text-[13px] text-rosa" role="status">{note}</p>}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden bg-noche pb-8 pt-[clamp(60px,8vw,110px)]">
      <div className="wrap">
        <p className="footer-sign font-display neon-text flicker-loop" aria-hidden="true">The Marquesa</p>
        <p className="mt-2 text-center font-script text-[clamp(30px,4vw,54px)] text-rosa">Burgers &amp; Chill</p>
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-hueso/10 pt-8 md:flex-row">
          <div className="flex items-center gap-3"><LogoBadge className="w-10" /><Wordmark className="text-[14px]" /></div>
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-[14px] text-hueso/80">
            <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="ulink" href={LINKTREE} target="_blank" rel="noopener noreferrer">Linktree</a>
            <a className="ulink" href={MAPS} target="_blank" rel="noopener noreferrer">Google Maps</a>
            <a className="ulink" href="./carta.html" target="_blank" rel="noopener">{t.nav.menu}</a>
            <a className="ulink" href="#inicio" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top}</a>
          </nav>
        </div>
        <p className="mt-6 text-center text-[12px] text-hueso/40">© {new Date().getFullYear()} The Marquesa · Cra 50D # 90-26, Medellín. {t.foot.rights}</p>
      </div>
    </footer>
  );
}

// Botón flotante: WhatsApp si hay número, si no Instagram
export function FloatChat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.9);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const href = PHONE ? `https://wa.me/${PHONE}` : `https://ig.me/m/${IG}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={PHONE ? 'WhatsApp' : 'Instagram'} className={`float-chat ${show ? 'on' : ''}`}>
      {PHONE ? (
        <svg viewBox="0 0 24 24" className="w-6 fill-current" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-6 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
      )}
    </a>
  );
}
