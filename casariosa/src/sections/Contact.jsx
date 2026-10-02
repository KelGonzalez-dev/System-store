import { useState } from 'react';
import { CONTACT, waLink } from '../data/content';
import { useLang } from '../i18n/LangContext';
import Reveal from '../components/Reveal';
import { Icon, WhatsAppIcon } from '../components/Icons';

const field = 'w-full rounded-xl border border-cream/15 bg-night px-4 py-3.5 text-[16px] text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold [color-scheme:dark]';

export default function Contact() {
  const { t } = useLang();
  const [v, setV] = useState({ name: '', date: '', time: '', people: '2' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    window.open(waLink(t.contact.msg(v)), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="reservas" className="relative overflow-hidden bg-coal py-20 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-wine/25 blur-[130px]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 className="h-display mt-5 text-5xl text-cream sm:text-7xl">
            {t.contact.title1}
            <span className="script gold-shimmer block text-[1.05em] font-normal">{t.contact.title2}</span>
          </h2>
          <p className="mt-6 max-w-sm text-cream/70">{t.contact.text}</p>
          <ul className="mt-10 space-y-5">
            <li className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="phone" /></span><div><p className="font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/50">{t.contact.phone}</p><a href={`tel:+${CONTACT.whatsapp}`} className="text-lg text-cream">{CONTACT.phoneDisplay}</a></div></li>
            <li className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="clock" /></span><div><p className="font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/50">{t.contact.hours}</p><p className="text-lg text-cream">{t.location.hours}</p></div></li>
            <li className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 text-gold"><Icon name="instagram" /></span><div><p className="font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/50">{t.contact.follow}</p><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="text-lg text-cream">{CONTACT.instagramHandle}</a></div></li>
          </ul>
        </Reveal>

        <Reveal v="right" delay={120} className="lg:col-span-7">
          <form onSubmit={enviar} className="s3d-r rounded-[2rem] border border-cream/10 bg-night p-6 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/60">{t.contact.name}</span>
                <input value={v.name} onChange={set('name')} placeholder={t.contact.namePh} autoComplete="name" className={field} />
              </label>
              <label className="block">
                <span className="mb-2 block font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/60">{t.contact.date}</span>
                <input type="date" value={v.date} onChange={set('date')} className={field} />
              </label>
              <label className="block">
                <span className="mb-2 block font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/60">{t.contact.time}</span>
                <input type="time" value={v.time} onChange={set('time')} className={field} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block font-display text-[11px] font-bold uppercase tracking-[.26em] text-cream/60">{t.contact.people}</span>
                <select value={v.people} onChange={set('people')} className={field}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
            <button type="submit" className="btn btn-wine mt-8 w-full py-4"><WhatsAppIcon className="h-5 w-5" />{t.contact.send}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
