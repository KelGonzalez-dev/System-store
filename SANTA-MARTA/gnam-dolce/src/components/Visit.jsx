import { useEffect, useState } from 'react';
import { DolceVita, GnamLogo, Swoosh } from './Brand';
import { HOURS } from '../data';
import { ADDRESS, IG, MAPS, WHATSAPP, useI18n, wa } from '../i18n';
import { fmtMin, status } from '../lib/hours';
import { scrollToTarget } from '../lib/scroll';

export function Visit() {
  const { t, lang } = useI18n();
  const v = t.visit;
  const [f, setF] = useState({ n: '', d: '', h: '09:30', p: '2', c: '' });
  const [s, setS] = useState(status);
  useEffect(() => { const id = setInterval(() => setS(status()), 60000); return () => clearInterval(id); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const isTue = f.d && new Date(`${f.d}T12:00:00`).getDay() === 2;
  const submit = (e) => {
    e.preventDefault();
    if (isTue) return;
    window.open(wa(v.msg(f.n, f.d, f.h, `${f.p} ${+f.p === 1 ? v.one : v.many}`, f.c.trim())), '_blank', 'noopener');
  };
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <section id="visitanos" className="visit-sec">
      <div className="wrap py-[clamp(80px,10vw,130px)]">
        <div className="max-w-[640px]">
          <h2 className="rv mask-up sec-title"><span>{v.title}</span></h2>
          <p className="rv mt-4 text-[17px] text-choco/75">{v.lead}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="grid content-start gap-4">
            <div className="hours-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <b className="hc-title">{v.hours}</b>
                <span className={`open-badge ${s.open ? 'is-open' : ''}`}><i />{s.open ? `${v.open} · ${v.until} ${fmtMin(s.close, lang)}` : v.closedNow}</span>
              </div>
              <ul className="mt-3">
                {order.map((d) => {
                  const h = HOURS[d];
                  return (
                    <li key={d} className={`${d === s.day ? 'today' : ''} ${!h ? 'off' : ''}`}>
                      <span>{t.days[d]}{d === s.day && <em>{v.today}</em>}</span>
                      <span>{h ? h.map(([a, b]) => `${fmtMin(a, lang)} – ${fmtMin(b, lang)}`).join(' · ') : v.closed}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="info-card"><b>{v.addr}</b><p>{ADDRESS}</p><a href={MAPS} target="_blank" rel="noopener noreferrer" className="ulink">{v.map} →</a></div>
            <div className="info-card"><b>{v.book}</b><p>+57 321 408 6024</p><a href={wa(t.hero.msg)} target="_blank" rel="noopener noreferrer" className="ulink">WhatsApp →</a></div>
          </div>
          <form onSubmit={submit} className="res-card">
            <DolceVita className="res-dv" />
            <h3>{v.formT}</h3>
            <div className="fld mt-5"><label htmlFor="rn">{v.name}</label><input id="rn" required placeholder={v.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="fld"><label htmlFor="rd">{v.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} /></div>
              <div className="fld"><label htmlFor="rh">{v.time}</label><input id="rh" type="time" required value={f.h} onChange={set('h')} /></div>
            </div>
            {isTue && <p className="tue-warn">{v.tuesday}</p>}
            <div className="fld mt-4"><label htmlFor="rp">{v.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? v.many : v.one}</option>)}</select></div>
            <div className="fld mt-4"><label htmlFor="rc">{v.occ}</label><input id="rc" placeholder={v.occPh} value={f.c} onChange={set('c')} /></div>
            <button type="submit" className="btn btn-yellow mt-7 w-full" disabled={isTue}>{v.send}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <Swoosh className="foot-swoosh" />
      <div className="wrap relative flex flex-col items-center py-16 text-center">
        <div className="w-[min(320px,70vw)]"><GnamLogo /></div>
        <p className="foot-tag">#TULUGARDULCE</p>
        <p className="mt-4 text-[14px] text-choco/60">{ADDRESS} · {t.visit.book}: 321 408 6024</p>
        <div className="mt-5 flex gap-5 text-[14px] font-semibold text-choco/80">
          <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a>
          <a className="ulink" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="ulink" href={MAPS} target="_blank" rel="noopener noreferrer">Google Maps</a>
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-3 border-t border-choco/15 pt-6 text-[12px] text-choco/50 md:flex-row">
          <span>© {new Date().getFullYear()} Gnam Dolce. {t.foot.rights}</span>
          <a href="#inicio" className="ulink" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function FloatBook() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return <a href={wa(t.hero.msg)} target="_blank" rel="noopener noreferrer" className={`float-book ${show ? 'on' : ''}`} aria-label={t.nav.book}><span className="fb-dot" aria-hidden="true">G</span><span>{t.nav.book}</span></a>;
}
