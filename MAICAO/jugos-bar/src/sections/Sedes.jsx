import { SEDES, mapsLink } from '../data/content';
import { link } from '../router';
import Reveal from '../components/Reveal';
import { Icon } from '../components/Icons';

export default function Sedes() {
  return (
    <section id="sedes" className="relative overflow-hidden bg-s2 py-20 text-fg sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">Nuestras sedes</p>
            <h2 className="h-display mt-5 text-5xl sm:text-7xl lg:text-8xl">Cuatro sedes,<br />un solo sabor</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-sm text-fg/65">Cada sede tiene su propio menú y su propio WhatsApp. Elige la más cercana y pide.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SEDES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 90} v="up">
              <article className="sede-card lt-green flex h-full flex-col rounded-[2rem] border border-fg/10 bg-card p-6 text-fg shadow-[0_20px_40px_-28px_rgba(0,0,0,.35)] sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="sc-n font-display text-6xl font-extrabold leading-none text-transparent sm:text-7xl" style={{ WebkitTextStroke: '2px rgb(var(--num))' }}>{s.n}</span>
                  <span className="rounded-full border border-fg/20 px-3 py-1 text-xs font-bold uppercase tracking-[.2em] text-fg/80 sc-m">{s.city}</span>
                </div>
                <h3 className="sc-t mt-8 font-display text-4xl font-extrabold uppercase leading-[.95] sm:text-5xl">{s.name}</h3>
                <p className="sc-m mt-3 flex items-start gap-2 text-fg/65 lt:text-fg/90"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0" />{s.address}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a {...link(`#/menu/${s.id}`)} className="btn btn-ink">Ver menú<Icon name="arrow" className="h-4 w-4" /></a>
                  <a href={mapsLink(s)} target="_blank" rel="noopener noreferrer" className="sc-m inline-flex items-center gap-2 text-sm font-bold text-fg/80 underline-offset-4 hover:underline">Cómo llegar<Icon name="arrow" className="h-4 w-4" /></a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
