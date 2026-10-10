import { useEffect, useState } from 'react';
import { QuileLogo } from './Brand';
import { WaIcon } from './Nav';
import { ADDRESS, IG, MAPS, WHATSAPP, useI18n, wa } from '../i18n';
import { scrollToTarget } from '../lib/scroll';

export function Visit() {
  const { t, lang } = useI18n();
  const v = t.visit;
  const [f, setF] = useState({ n: '', d: '', h: '19:00', p: '4', c: '' });
  const [map, setMap] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const people = `${f.p} ${+f.p === 1 ? v.one : v.many}`;
    window.open(wa(v.msg(f.n, f.d, f.h, people, f.c.trim())), '_blank', 'noopener');
  };
  return (
    <section id="visitanos" className="visit-sec relative overflow-hidden py-[clamp(80px,10vw,130px)]">
      <div className="wrap">
        <div className="max-w-[640px]">
          <h2 className="rv mask-up sec-title text-crema"><span>{v.title}</span></h2>
          <p className="rv mt-4 text-[16px] leading-relaxed text-crema/75">{v.lead}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="grid gap-4">
            <div className="info-card">
              <span>📍</span>
              <div><b>{v.addr}</b><p>{ADDRESS}</p><a href={MAPS} target="_blank" rel="noopener noreferrer" className="ulink">{v.map} →</a></div>
            </div>
            <div className="info-card">
              <span>💬</span>
              <div><b>{v.wa}</b><p>+57 318 754 8324</p><a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className="ulink">{t.hero.c1} →</a></div>
            </div>
            <div className="info-card">
              <span>🕒</span>
              <div><b>{v.hours}</b><p>{v.hoursV}</p></div>
            </div>
            <div className="map-card">
              {map ? (
                <iframe title="Mapa" src={`https://maps.google.com/maps?q=${encodeURIComponent('Quile Parrilla, Calle 15 # 7-87, Riohacha')}&z=16&output=embed&hl=${lang}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <button type="button" className="map-cover" onClick={() => setMap(true)}>
                  <span className="pin" aria-hidden="true">📍</span>
                  <b>Quile Parrilla</b>
                  <span>{v.map}</span>
                </button>
              )}
            </div>
          </div>
          <form onSubmit={submit} className="res-card">
            <h3>{v.formT}</h3>
            <div className="fld mt-5"><label htmlFor="rn">{v.name}</label><input id="rn" required placeholder={v.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="fld"><label htmlFor="rd">{v.date}</label><input id="rd" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} /></div>
              <div className="fld"><label htmlFor="rh">{v.time}</label><input id="rh" type="time" required value={f.h} onChange={set('h')} /></div>
            </div>
            <div className="fld mt-4"><label htmlFor="rp">{v.people}</label><select id="rp" value={f.p} onChange={set('p')}>{Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? v.many : v.one}</option>)}</select></div>
            <div className="fld mt-4"><label htmlFor="rc">{v.note}</label><input id="rc" placeholder={v.notePh} value={f.c} onChange={set('c')} /></div>
            <button type="submit" className="btn btn-fire mt-7 w-full"><WaIcon />{v.send}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot relative overflow-hidden">
      <div className="wrap flex flex-col items-center py-16 text-center">
        <div className="w-[min(320px,70vw)]"><QuileLogo /></div>
        <p className="mt-6 font-script text-[28px] text-fuego">{t.loader.tag}</p>
        <p className="mt-3 text-[14px] text-crema/60">{ADDRESS} · +57 318 754 8324</p>
        <div className="mt-6 flex gap-5 text-[14px] font-semibold">
          <a className="ulink" href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a className="ulink" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a className="ulink" href={MAPS} target="_blank" rel="noopener noreferrer">Google Maps</a>
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-between gap-3 border-t border-crema/10 pt-6 text-[12px] text-crema/45 md:flex-row">
          <span>© {new Date().getFullYear()} Quile Parrilla Riohacha. {t.foot.rights}</span>
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
  return (
    <a href={wa(t.hero.waMsg)} target="_blank" rel="noopener noreferrer" className={`float-wa ${show ? 'on' : ''}`} aria-label={t.hero.c1}>
      <WaIcon /><span>{t.nav.order}</span>
    </a>
  );
}
