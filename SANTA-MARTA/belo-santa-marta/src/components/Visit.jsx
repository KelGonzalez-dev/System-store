import { useEffect, useState } from 'react';
import { Wordmark } from './Brand';
import { WaIcon } from './Nav';
import { ADDRESS, IG, IG_ROOF, MAPS, MENU_URL, WHATSAPP, useI18n, wa } from '../i18n';
import { scrollToTarget } from '../lib/scroll';

export function Visit() {
  const { t } = useI18n();
  const v = t.visit;
  const [f, setF] = useState({ n: '', d: '', h: '20:00', p: '2', z: 0, c: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    window.open(wa(v.msg(f.n, f.d, f.h, `${f.p} ${+f.p === 1 ? v.one : v.many}`, v.zones[f.z], f.c.trim())), '_blank', 'noopener');
  };
  return (
    <section id="visitanos" className="visit-sec py-[clamp(80px,10vw,130px)]">
      <div className="wrap">
        <div className="max-w-[660px]">
          <h2 className="rv mask-up sec-title"><span>{v.title}</span></h2>
          <p className="rv mt-4 text-[16px] leading-relaxed text-crema/70">{v.lead}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="grid content-start gap-4">
            <div className="info-card"><span>📍</span><div><b>{v.addr}</b><p>{ADDRESS}</p><a href={MAPS} target="_blank" rel="noopener noreferrer" className="ulink">{v.map} →</a></div></div>
            <div className="info-card"><span>🕒</span><div><b>{v.hours}</b><p>{v.lunchH}</p><p className="opacity-70">{v.otherH}</p></div></div>
            <div className="info-card"><span>💬</span><div><b>{v.book}</b><p>+57 324 511 2834</p><a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="ulink">{t.hero.c1} →</a></div></div>
            <div className="info-card"><span>📖</span><div><b>{t.menu.digital}</b><p>belo.cluvi.co</p><a href={MENU_URL} target="_blank" rel="noopener noreferrer" className="ulink">{t.menu.full} →</a></div></div>
          </div>
          <form onSubmit={submit} className="res-card">
            <h3>{v.formT}</h3>
            <div className="fld mt-5"><label htmlFor="rn">{v.name}</label><input id="rn" required placeholder={v.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="fld"><label htmlFor="rd">{v.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} /></div>
              <div className="fld"><label htmlFor="rh">{v.time}</label><input id="rh" type="time" required value={f.h} onChange={set('h')} /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="fld"><label htmlFor="rp">{v.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? v.many : v.one}</option>)}</select></div>
              <div className="fld"><label htmlFor="rz">{v.zone}</label><select id="rz" value={f.z} onChange={set('z')}>{v.zones.map((z, i) => <option key={z} value={i}>{z}</option>)}</select></div>
            </div>
            <div className="fld mt-4"><label htmlFor="rc">{v.note}</label><input id="rc" placeholder={v.notePh} value={f.c} onChange={set('c')} /></div>
            <button type="submit" className="btn btn-gold mt-7 w-full"><WaIcon />{v.send}</button>
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
      <div className="wrap flex flex-col items-center py-16 text-center">
        <div className="w-[min(260px,60vw)]"><Wordmark /></div>
        <p className="mt-4 font-display text-[22px] italic text-oro">{t.loader.tag} · {t.hero.sub1}</p>
        <p className="mt-3 text-[14px] text-crema/55">{ADDRESS}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-5 text-[14px] font-semibold text-crema/80">
          <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a>
          <a className="ulink" href={`https://www.instagram.com/${IG_ROOF}`} target="_blank" rel="noopener noreferrer">@{IG_ROOF}</a>
          <a className="ulink" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="ulink" href={MAPS} target="_blank" rel="noopener noreferrer">Google Maps</a>
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-3 border-t border-oro/15 pt-6 text-[12px] text-crema/40 md:flex-row">
          <span>© {new Date().getFullYear()} BELO · Cocina & Rooftop. {t.foot.rights}</span>
          <a href="#inicio" className="ulink" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>{t.foot.top} ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function FloatWA() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className={`float-wa ${show ? 'on' : ''}`} aria-label={t.hero.c1}><WaIcon /><span>{t.nav.book}</span></a>;
}
