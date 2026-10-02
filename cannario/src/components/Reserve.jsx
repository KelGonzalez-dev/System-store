import { useEffect, useState } from 'react';
import Logo from './Logo';
import { PHONE, useI18n } from '../i18n';
import { scrollToTarget } from '../lib/scroll';

const Ico = ({ children }) => <svg viewBox="0 0 32 32" className="mt-0.5 w-7 shrink-0 fill-none stroke-gold" strokeWidth="1.3" aria-hidden="true">{children}</svg>;

export function Reserve() {
  const { t, lang } = useI18n();
  const r = t.res;
  const [f, setF] = useState({ n: '', d: '', h: '20:00', p: '2', o: 0 });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const people = `${f.p} ${+f.p === 1 ? r.one : r.many}`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(r.msg(f.n, f.d, f.h, people, r.occ[f.o]))}`, '_blank', 'noopener');
  };
  const info = [
    [<Ico key="i"><path d="M16 29s9-8.5 9-16a9 9 0 1 0-18 0c0 7.5 9 16 9 16z" /><circle cx="16" cy="13" r="3.2" /></Ico>, r.addr,
      <a key="v" className="ulink" href="https://www.google.com/maps/search/?api=1&query=Cannario+Rooftop+Medell%C3%ADn" target="_blank" rel="noopener noreferrer">Cr A29C #1 A Sur-80, Medellín<br /><span className="text-gold-dark">{r.map}</span></a>],
    [<Ico key="i"><path d="M8 4h5l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v5a3 3 0 0 1-3 3C14 27 5 18 5 7a3 3 0 0 1 3-3z" /></Ico>, r.phone, <a key="v" className="ulink" href="tel:+573152523958">+57 315 252 3958</a>],
    [<Ico key="i"><circle cx="16" cy="16" r="12" /><path d="M16 9v7l5 3" /></Ico>, r.hours, <span key="v">{r.hoursV}</span>],
    [<Ico key="i"><rect x="4" y="12" width="24" height="10" rx="3" /><circle cx="10" cy="24" r="2.4" /><circle cx="22" cy="24" r="2.4" /><path d="M8 12l3-6h10l3 6" /></Ico>, r.valet, <span key="v">{r.valetV}</span>],
  ];
  return (
    <section id="reservas" className="relative bg-stone-soft py-[clamp(70px,9vw,120px)]">
      <div className="wrap grid items-start gap-[clamp(48px,6vw,90px)] lg:grid-cols-[1fr_minmax(0,460px)]">
        <div>
          <h2 className="rv mask-up sec-title text-ash"><span>{r.title}</span></h2>
          <p className="rv mt-5 max-w-[40ch] text-[17px] font-light leading-relaxed text-mute">{r.lead}</p>
          <dl className="mt-10 grid gap-7 sm:grid-cols-2">
            {info.map(([ic, b, v]) => (
              <div key={b} className="flex items-start gap-4">
                {ic}
                <div><dt className="text-[13px] font-medium text-ash">{b}</dt><dd className="mt-1 text-[16px] font-light leading-snug text-ink">{v}</dd></div>
              </div>
            ))}
          </dl>
        </div>

        <form onSubmit={submit} className="reserve-arch">
          <Logo className="mx-auto w-9" />
          <h3 className="mt-3 text-center font-display text-[clamp(24px,2.4vw,32px)] leading-tight text-stone-soft">{r.formT}</h3>
          <div className="fld mt-8"><label htmlFor="rn">{r.name}</label><input id="rn" required placeholder={r.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
          <div className="mt-4 grid grid-cols-2 gap-3.5">
            <div className="fld"><label htmlFor="rd">{r.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} lang={lang} /></div>
            <div className="fld"><label htmlFor="rh">{r.time}</label><input id="rh" type="time" required value={f.h} onChange={set('h')} /></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3.5">
            <div className="fld"><label htmlFor="rp">{r.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 14 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? r.many : r.one}</option>)}</select></div>
            <div className="fld"><label htmlFor="ro">{r.occasion}</label><select id="ro" value={f.o} onChange={set('o')}>{r.occ.map((o, i) => <option key={o} value={i}>{o}</option>)}</select></div>
          </div>
          <button type="submit" className="btn btn-gold mt-8 w-full">{r.send}</button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden bg-ash-deep text-stone">
      <div className="wrap pt-[clamp(70px,9vw,120px)]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo className="w-12" />
            <p className="mt-5 max-w-[26ch] font-display text-[26px] italic leading-snug text-gold-light">{t.hero.tag}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-14 gap-y-3 text-[15px]">
            <a className="ulink" href="https://www.instagram.com/cannario.rooftop" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="ulink" href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="ulink" href="https://linktr.ee/cannario.rooftop" target="_blank" rel="noopener noreferrer">Linktree</a>
            <a className="ulink" href="tel:+573152523958">{t.foot.call}</a>
            <a className="ulink" href="#carta" onClick={(e) => { e.preventDefault(); scrollToTarget('#carta'); }}>{t.nav.menu}</a>
            <a className="ulink" href="#inicio" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top}</a>
          </div>
        </div>
        <p className="footer-word font-display" aria-hidden="true">cannario</p>
        <div className="flex flex-col gap-2 border-t border-stone/10 py-7 text-[13px] text-stone/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Cannario Rooftop, Medellín. {t.foot.rights}</span>
          <span>Cr A29C #1 A Sur-80</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsApp({ show }) {
  // aparece cuando el hero ya se abrió, para no tapar los botones principales
  const [past, setPast] = useState(false);
  useEffect(() => {
    const f = () => setPast(window.scrollY > window.innerHeight * 1.7);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  show = show && past;
  return (
    <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`wa ${show ? 'on' : ''}`}>
      <svg viewBox="0 0 24 24" className="w-6 fill-current" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
    </a>
  );
}
