import { useRef, useState } from 'react';
import { RATING, REVIEWS, SEDES, sedeById, waLink } from '../data/content';
import Reveal from '../components/Reveal';
import { Icon, WhatsAppIcon } from '../components/Icons';

const Star = ({ on, delay = 0, className = 'h-5 w-5', off = 'text-fg/15' }) => (
  <svg viewBox="0 0 24 24" className={`${className} ${on ? 'text-brand' : off}`} style={{ animationDelay: `${delay}ms` }} fill="currentColor" aria-hidden="true">
    <path d="m12 2.8 2.8 5.9 6.4.9-4.7 4.4 1.2 6.4L12 17.3 6.3 20.4l1.2-6.4L2.8 9.6l6.4-.9L12 2.8Z" />
  </svg>
);

const Stars = ({ n, className }) => (
  <span className="inline-flex gap-0.5" role="img" aria-label={`${n} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} on={i <= n} delay={i * 70} className={className} />)}
  </span>
);

const field = 'w-full rounded-xl border-2 border-transparent bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none';

function ReviewForm() {
  const [name, setName] = useState('');
  const [sede, setSede] = useState(SEDES[0].id);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');

  const send = (e) => {
    e.preventDefault();
    const s = sedeById(sede);
    const msg = `Hola ${s.name}, quiero dejar una reseña.\n\nCalificación: ${stars}/5${name ? `\nNombre: ${name}` : ''}${text ? `\n\n${text}` : ''}`;
    window.open(waLink(s, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={send} className="rounded-[2rem] bg-brand p-6 text-ink shadow-[0_30px_60px_-30px_rgba(61,130,0,.6)] sm:p-8">
      <h3 className="font-display text-3xl font-extrabold uppercase leading-none sm:text-4xl">Cuéntanos<br />cómo te fue</h3>
      <div className="mt-6 space-y-3 text-ink">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoComplete="name" className={field} />
        <select value={sede} onChange={(e) => setSede(e.target.value)} aria-label="Sede" className={field}>
          {SEDES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5">
          <span className="text-sm font-bold text-ink/60">Tu calificación</span>
          <span className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setStars(i)} aria-label={`${i} estrellas`} aria-pressed={stars === i} className="transition-transform duration-200 hover:scale-125 active:scale-90">
                <Star on={i <= stars} className="h-7 w-7" off="text-ink/20" />
              </button>
            ))}
          </span>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="¿Qué fue lo que más te gustó?" className={`${field} resize-none`} />
      </div>
      <button type="submit" className="btn btn-dark mt-5 w-full py-4"><WhatsAppIcon className="h-5 w-5" />Enviar mi reseña</button>
    </form>
  );
}

export default function Resenas() {
  const track = useRef(null);
  const move = (d) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: d * Math.min(420, el.clientWidth * 0.85), behavior: 'smooth' });
  };

  return (
    <section id="resenas" className="relative overflow-hidden bg-s2 py-20 text-fg sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Reseñas</p>
            <h2 className="h-display mt-5 text-5xl sm:text-7xl lg:text-8xl">Lo dicen<br />nuestros clientes</h2>
          </Reveal>
          <Reveal delay={150} className="flex items-center gap-5">
            <span className="font-display text-7xl font-extrabold leading-none text-acc sm:text-8xl">{String(RATING).replace('.', ',')}</span>
            <span>
              <Stars n={Math.round(RATING)} className="h-6 w-6" />
              <span className="mt-1 block text-sm font-bold text-fg/60">de 5 en las 4 sedes</span>
            </span>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-12">
        <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:gap-5 sm:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.n} delay={i * 70} v="up" className="w-[82vw] shrink-0 snap-center sm:w-[24rem]">
              <article className="group relative flex h-full flex-col rounded-[2rem] border border-fg/10 bg-card p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,.45)]">
                <span className="absolute right-6 top-3 font-display text-8xl font-extrabold leading-none text-brand/25 transition-colors duration-500 group-hover:text-brand" aria-hidden="true">”</span>
                <Stars n={r.stars} />
                <p className="mt-5 flex-1 text-[17px] leading-relaxed text-fg/80">{r.t}</p>
                <footer className="mt-6 flex items-center gap-3 border-t border-fg/10 pt-5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand font-display text-lg font-extrabold text-ink">{r.n[0]}</span>
                  <span className="min-w-0">
                    <span className="block font-bold">{r.n}</span>
                    <span className="block truncate text-sm text-fg/55">{r.sede}</span>
                  </span>
                </footer>
              </article>
            </Reveal>
          ))}
          <div className="w-1 shrink-0" />
        </div>

        <div className="container-x mt-2 hidden justify-end gap-3 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Reseñas anteriores" className="grid h-12 w-12 place-items-center rounded-full border-2 border-fg/20 transition-colors hover:border-brand hover:bg-brand hover:text-ink"><Icon name="arrowLeft" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Más reseñas" className="grid h-12 w-12 place-items-center rounded-full bg-brand text-ink transition-transform hover:scale-105 active:scale-95"><Icon name="arrow" /></button>
        </div>
      </div>

      <div className="container-x mt-12 grid items-center gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-6" v="left">
          <p className="font-display text-4xl font-extrabold uppercase leading-[.95] sm:text-5xl">¿Ya probaste?<br /><span className="text-acc">Cuéntanos.</span></p>
          <p className="mt-4 max-w-md text-fg/65">Tu opinión nos ayuda a mejorar en cada sede. Escríbela y te llega directo al WhatsApp de la sede que elijas.</p>
        </Reveal>
        <Reveal className="lg:col-span-6" v="right"><ReviewForm /></Reveal>
      </div>
    </section>
  );
}
