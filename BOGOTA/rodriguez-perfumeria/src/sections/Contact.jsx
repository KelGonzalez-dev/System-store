import { useState } from 'react';
import { CONTACT, waLink } from '../data/content';
import Reveal from '../components/Reveal';
import Photo from '../components/Photo';
import { Icon, WhatsAppIcon } from '../components/Icons';

const OPTS = ['Perfume para hombre', 'Perfume para mujer', 'Unisex', 'Árabes y nicho', 'Un regalo'];
const field = 'w-full rounded-xl border border-gold/15 bg-ink px-4 py-3.5 text-[16px] text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold [color-scheme:dark]';
const label = 'mb-2 block font-body text-[10px] font-medium uppercase tracking-[.28em] text-ivory/55';

export default function Contact() {
  const [v, setV] = useState({ name: '', want: OPTS[0], note: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const send = (e) => {
    e.preventDefault();
    const text = `Hola Rodriguez Perfumería${v.name ? `, soy ${v.name}` : ''}. Busco: ${v.want}.${v.note ? ` ${v.note}` : ''}`;
    window.open(waLink(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contacto" className="cv-auto relative overflow-hidden bg-ink py-20 sm:py-32">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,106,.14), transparent 65%)' }} />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Contacto</p>
          <h2 className="h-display mt-5 text-5xl sm:text-7xl">
            Hablemos de <span className="glow-gold block">tu próxima fragancia</span>
          </h2>
          <p className="mt-6 max-w-sm text-ivory/60">Cuéntanos qué buscas y te respondemos por WhatsApp.</p>
          <ul className="mt-10 space-y-5">
            <li className="flex items-center gap-4">
              <span className="hairline grid h-12 w-12 place-items-center rounded-full border text-gold"><WhatsAppIcon className="h-5 w-5" /></span>
              <div><p className="font-body text-[10px] uppercase tracking-[.28em] text-ivory/45">WhatsApp</p><a href={waLink('Hola Rodriguez Perfumería')} target="_blank" rel="noopener noreferrer" className="font-display text-2xl">{CONTACT.phoneDisplay}</a></div>
            </li>
            <li className="flex items-center gap-4">
              <span className="hairline grid h-12 w-12 place-items-center rounded-full border text-gold"><Icon name="instagram" /></span>
              <div><p className="font-body text-[10px] uppercase tracking-[.28em] text-ivory/45">Instagram</p><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="font-display text-2xl">{CONTACT.instagramHandle}</a></div>
            </li>
          </ul>
          <div className="hairline relative mt-8 aspect-[16/9] max-w-md overflow-hidden rounded-[1.5rem] border">
            <Photo k="pour" w={800} alt="Perfumería de autor" className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,4,3,.7), transparent 60%)' }} />
          </div>
        </Reveal>

        <Reveal v="right" delay={120} className="lg:col-span-7">
          <form onSubmit={send} className="hairline s3d-r rounded-[2rem] border bg-noir p-6 sm:p-10">
            <div className="grid gap-5">
              <label className="block"><span className={label}>Tu nombre</span><input value={v.name} onChange={set('name')} placeholder="¿Cómo te llamas?" autoComplete="name" className={field} /></label>
              <label className="block"><span className={label}>¿Qué buscas?</span>
                <select value={v.want} onChange={set('want')} className={field}>{OPTS.map((o) => <option key={o}>{o}</option>)}</select>
              </label>
              <label className="block"><span className={label}>Mensaje (opcional)</span><textarea value={v.note} onChange={set('note')} rows="3" placeholder="Aromas que te gustan, presupuesto, ocasión…" className={field} /></label>
            </div>
            <button type="submit" className="btn btn-gold mt-8 w-full py-4"><WhatsAppIcon className="h-5 w-5" />Enviar por WhatsApp</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
