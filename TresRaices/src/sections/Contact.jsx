import { useState } from 'react';
import { CONTACT, BRAND, waLink, pic } from '../data/content';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { Icon, WhatsAppIcon } from '../components/Icons';

const WHO = ['Productor', 'Comprador', 'Aliado'];
const field =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink/40 focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50';

export default function Contact() {
  const [name, setName] = useState('');
  const [who, setWho] = useState(WHO[0]);
  const [msg, setMsg] = useState('');

  /* Sin servidor: el formulario abre WhatsApp con el mensaje ya escrito */
  const submit = (e) => {
    e.preventDefault();
    const text = `Hola Tres Raíces, soy ${name || 'un interesado'} (${who}). ${msg}`.trim();
    window.open(waLink(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contacto" className="relative isolate overflow-hidden bg-forest py-20 text-white sm:py-28">
      <div className="absolute inset-0 -z-10">
        <SmartImage src={pic('hands', 1600)} alt="Manos sosteniendo una planta joven" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/85 to-forest/60" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal v="left" className="lg:col-span-6">
          <h2 className="h-display text-4xl sm:text-6xl">Juntos cultivamos un mejor mañana</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
            Si eres productor, comprador o aliado, te invitamos a ser parte de esta gran familia.
          </p>
          <ul className="mt-8 space-y-4 text-[16px]">
            <li className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Icon name="pin" className="h-5 w-5" /></span>{CONTACT.place}</li>
            <li className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Icon name="phone" className="h-5 w-5" /></span><a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a></li>
            <li className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Icon name="mail" className="h-5 w-5" /></span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          </ul>
          <p className="mt-8 text-sm text-white/60">{BRAND.legal} · {BRAND.sigla}</p>
        </Reveal>

        <Reveal v="right" delay={120} className="lg:col-span-6">
          <form onSubmit={submit} className="s3d-r rounded-3xl bg-cream p-6 text-ink shadow-2xl shadow-black/40 sm:p-8">
            <p className="font-display text-2xl font-bold text-forest">Escríbenos</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Tu nombre</span>
                <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" />
              </label>
              <fieldset>
                <legend className="mb-1.5 text-sm font-semibold">Soy</legend>
                <div className="grid grid-cols-3 gap-2">
                  {WHO.map((w) => (
                    <button
                      type="button"
                      key={w}
                      onClick={() => setWho(w)}
                      aria-pressed={who === w}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        who === w ? 'border-leaf bg-leaf text-white' : 'border-ink/15 bg-white text-ink hover:border-leaf'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Mensaje</span>
                <textarea className={`${field} min-h-[110px] resize-none`} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Cuéntanos qué necesitas" />
              </label>
            </div>
            <button type="submit" className="btn mt-6 w-full bg-leaf py-3.5 text-white shadow-lg shadow-leaf/30 hover:bg-forest">
              <WhatsAppIcon className="h-5 w-5" /> Enviar por WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
