import { useMemo, useState } from 'react';
import Logo from './Logo';
import { GROUPS, MENU } from '../data';
import { PHONE, useI18n } from '../i18n';

const cop = (n, lang) => new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export function Marquee() {
  const { t } = useI18n();
  const row = [...t.mq, ...t.mq];
  return (
    <div className="overflow-hidden border-y border-gold/20 bg-gradient-to-r from-deep via-panel to-deep py-5">
      <div className="flex w-max" style={{ animation: 'mq 34s linear infinite' }}>
        {[0, 1].map((k) => <div key={k} className="flex">{row.map((w, i) => <span key={i} className="whitespace-nowrap pr-11 font-serif text-[clamp(22px,3vw,32px)] italic">{w}<b className="ml-11 not-italic text-gold">✦</b></span>)}</div>)}
      </div>
    </div>
  );
}

const ICONS = [
  <path key="a" d="M4 50h56M10 50V30l10-8 10 8v20M34 50V18l12-10 12 10v32" />,
  <path key="b" d="M14 40c0-14 8-22 18-22s18 8 18 22zM8 48h48M32 10v6" />,
  <path key="c" d="M12 10h40L32 34zM32 34v20M22 54h20" />,
];
export function Experience() {
  const { t } = useI18n();
  const glow = (e) => { const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; const c = e.currentTarget; c.style.setProperty('--mx', `${x * 100}%`); c.style.setProperty('--my', `${y * 100}%`); c.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg)`; };
  return (
    <section id="experiencia" className="py-[clamp(80px,12vw,150px)]">
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <p className="kick rv">{t.exp.kick}</p>
        <h2 className="h2 rv" style={{ '--d': '.1s' }}>{t.exp.a} <em className="gold-text">{t.exp.b}</em></h2>
        <p className="rv max-w-[560px] text-[17px] font-light text-mute" style={{ '--d': '.2s' }}>{t.exp.lead}</p>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.exp.cards.map((c, i) => (
            <article key={c.t} className="rv group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[26px] border border-gold/20 bg-gradient-to-br from-panel to-deep p-8 transition-[border-color] duration-500 hover:border-gold-light/60 md:min-h-[380px]" style={{ '--d': `${i * 0.12}s`, '--mx': '50%', '--my': '30%' }} onMouseMove={glow} onMouseLeave={(e) => (e.currentTarget.style.transform = '')}>
              <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(60% 50% at var(--mx) var(--my),rgba(243,212,138,.22),transparent 70%)' }} />
              <span className="absolute left-8 top-6 font-serif text-[76px] leading-none text-gold/20">0{i + 1}</span>
              <svg viewBox="0 0 64 64" className="absolute right-7 top-8 w-14 fill-none stroke-gold-light" strokeWidth="1.2">{ICONS[i]}</svg>
              <h3 className="mb-2 font-serif text-[34px] font-medium">{c.t}</h3>
              <p className="font-light text-mute">{c.d}</p>
            </article>
          ))}
        </div>
        <div className="rv mt-9 inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/10 px-6 py-3 text-[13px] uppercase tracking-[0.14em]"><i className="h-2 w-2 rounded-full bg-gold-light" style={{ animation: 'pulse2 2s infinite' }} />{t.exp.valet}</div>
      </div>
    </section>
  );
}

function Thumb({ item }) {
  const [bad, setBad] = useState(false);
  return (
    <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-[#22312e] to-[#0d1514] sm:h-[88px] sm:w-[88px]">
      {!bad ? <img src={`/images/menu/${item.id}.jpg`} alt="" loading="lazy" onError={() => setBad(true)} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center opacity-70"><Logo className="w-8" /></div>}
    </div>
  );
}

export function Menu() {
  const { t, lang, pick } = useI18n();
  const [group, setGroup] = useState('food');
  const [cat, setCat] = useState('starters');
  const pickGroup = (g) => { setGroup(g); setCat(GROUPS[g][0]); };
  const items = useMemo(() => MENU.filter((m) => m.cat === cat), [cat]);
  return (
    <section id="carta" className="py-[clamp(80px,12vw,150px)]" style={{ background: 'radial-gradient(70% 60% at 85% 20%,rgba(217,164,65,.1),transparent 60%),#0d1514' }}>
      <div className="mx-auto w-[min(1180px,100%-44px)]">
        <p className="kick rv">{t.menu.kick}</p>
        <h2 className="h2 rv" style={{ '--d': '.1s' }}>{t.menu.a} <em className="gold-text">{t.menu.b}</em></h2>
        <div className="rv mb-6 mt-8 inline-flex gap-1.5 rounded-full border border-gold/20 bg-panel p-1.5">
          {['food', 'drinks'].map((g) => <button key={g} onClick={() => pickGroup(g)} className={`rounded-full px-8 py-3 text-xs uppercase tracking-[0.22em] transition ${group === g ? 'bg-gradient-to-r from-gold-dark to-gold-light font-semibold text-[#1a1408]' : 'text-mute hover:text-gold-light'}`}>{t.menu[g]}</button>)}
        </div>
        <div className="no-scrollbar -mx-[22px] mb-10 flex gap-2 overflow-x-auto px-[22px]">
          {GROUPS[group].map((c) => <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-5 py-2.5 text-[13px] tracking-[0.08em] transition ${cat === c ? 'border-gold-light bg-gold/15 text-gold-light' : 'border-cream/15 text-cream/70 hover:border-gold/50'}`}>{t.menu.cats[c]}</button>)}
        </div>
        <div key={cat + lang} className="grid gap-x-16 md:grid-cols-2">
          {items.map((m, i) => (
            <div key={m.id} className="item flex items-center gap-4 border-b border-cream/10 py-5" style={{ '--k': i }}>
              <Thumb item={m} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <h4 className="font-serif text-[clamp(21px,2.4vw,27px)] font-medium leading-tight">{pick(m.n)}</h4>
                  <span className="mb-1.5 hidden min-w-5 flex-1 border-b border-dotted border-gold/50 sm:block" />
                  <span className="ml-auto whitespace-nowrap text-sm font-medium tracking-[0.08em] text-gold-light sm:ml-0">{cop(m.p, lang)}</span>
                </div>
                <p className="mt-1 text-[14.5px] font-light leading-snug text-mute">{pick(m.d)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[13px] italic text-mute">{t.menu.note}</p>
      </div>
    </section>
  );
}

const Ico = ({ children }) => <svg viewBox="0 0 32 32" className="mt-1 w-[26px] shrink-0 fill-none stroke-gold" strokeWidth="1.4">{children}</svg>;
export function Reserve() {
  const { t, lang } = useI18n();
  const r = t.res;
  const [f, setF] = useState({ n: '', d: '', h: '19:00', p: '2' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const people = `${f.p} ${+f.p === 1 ? r.one : r.many}`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(r.msg(f.n, f.d, f.h, people))}`, '_blank', 'noopener');
  };
  return (
    <section id="reservas" className="py-[clamp(80px,12vw,150px)]">
      <div className="mx-auto grid w-[min(1180px,100%-44px)] items-start gap-[clamp(30px,6vw,90px)] md:grid-cols-2">
        <div>
          <p className="kick rv">{r.kick}</p>
          <h2 className="h2 rv" style={{ '--d': '.1s' }}>{r.a} <em className="gold-text">{r.b}</em></h2>
          <p className="rv max-w-[560px] text-[17px] font-light text-mute" style={{ '--d': '.2s' }}>{r.lead}</p>
          <div className="mt-10 grid gap-6">
            {[
              [<Ico key="i"><path d="M16 29s9-8.5 9-16a9 9 0 1 0-18 0c0 7.5 9 16 9 16z" /><circle cx="16" cy="13" r="3.2" /></Ico>, r.addr, <a key="v" href="https://www.google.com/maps/search/?api=1&query=Cannario+Rooftop+Medell%C3%ADn" target="_blank" rel="noopener noreferrer">Cr A29C #1 A Sur-80, Medellín<br />{r.map}</a>],
              [<Ico key="i"><path d="M8 4h5l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v5a3 3 0 0 1-3 3C14 27 5 18 5 7a3 3 0 0 1 3-3z" /></Ico>, r.phone, <a key="v" href="tel:+573152523958">+57 (315) 252 3958</a>],
              [<Ico key="i"><circle cx="16" cy="16" r="12" /><path d="M16 9v7l5 3" /></Ico>, r.hours, <span key="v">{r.hoursV}</span>],
              [<Ico key="i"><rect x="4" y="12" width="24" height="10" rx="3" /><circle cx="10" cy="24" r="2.4" /><circle cx="22" cy="24" r="2.4" /><path d="M8 12l3-6h10l3 6" /></Ico>, r.valet, <span key="v">{r.valetV}</span>],
            ].map(([ic, b, v], i) => (
              <div key={b} className="rv flex items-start gap-4" style={{ '--d': `${i * 0.08}s` }}>{ic}<p><b className="mb-0.5 block text-xs font-medium uppercase tracking-[0.14em] text-gold-light">{b}</b><span className="font-light">{v}</span></p></div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="rv rounded-[28px] border border-gold/30 bg-gradient-to-br from-panel to-deep p-[clamp(26px,4vw,44px)] shadow-[0_40px_90px_-40px_#000]" style={{ '--d': '.15s' }}>
          <h3 className="font-serif text-4xl font-medium">{r.formT}</h3>
          <p className="mt-1 text-[15px] font-light text-mute">{r.formS}</p>
          <div className="fld mt-5"><label htmlFor="n">{r.name}</label><input id="n" required placeholder={r.namePh} autoComplete="name" value={f.n} onChange={set('n')} /></div>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <div className="fld"><label htmlFor="d">{r.date}</label><input id="d" type="date" required min={new Date().toISOString().slice(0, 10)} value={f.d} onChange={set('d')} lang={lang} /></div>
            <div className="fld"><label htmlFor="h">{r.time}</label><input id="h" type="time" required value={f.h} onChange={set('h')} /></div>
          </div>
          <div className="fld mt-4"><label htmlFor="p">{r.people}</label><select id="p" value={f.p} onChange={set('p')}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i ? r.many : r.one}</option>)}</select></div>
          <button type="submit" className="btn btn-gold mt-6 w-full">{r.send}</button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-gold/20 bg-[#070c0b] px-5 pb-10 pt-16 text-center">
      <Logo className="mx-auto mb-3.5 w-12" />
      <p className="font-serif text-[clamp(30px,6vw,56px)] tracking-[0.3em]">CANNARIO</p>
      <p className="font-serif text-[22px] italic text-gold-light">{t.hero.tag}</p>
      <div className="my-6 flex flex-wrap justify-center gap-3.5">
        {[['Instagram', 'https://www.instagram.com/cannario.rooftop'], ['Linktree', 'https://linktr.ee/cannario.rooftop'], [t.foot.call, 'tel:+573152523958']].map(([l, h]) => <a key={l} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="rounded-full border border-gold/35 px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-gold hover:text-ink">{l}</a>)}
      </div>
      <small className="text-xs text-mute">© 2026 Cannario Rooftop · Medellín, Colombia · {t.foot.rights}</small>
    </footer>
  );
}

export function WhatsApp({ show }) {
  return (
    <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`fixed bottom-[calc(18px+env(safe-area-inset-bottom,0px))] right-[18px] z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-[#1a1408] shadow-[0_14px_34px_-8px_rgba(217,164,65,.8)] transition duration-700 ${show ? 'scale-100' : 'scale-0'}`}>
      <span className="absolute inset-0 rounded-full border border-gold-light" style={{ animation: 'ring 2.4s ease-out infinite' }} />
      <svg viewBox="0 0 24 24" className="w-6 fill-current"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
    </a>
  );
}
