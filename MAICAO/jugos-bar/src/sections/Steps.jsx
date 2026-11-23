import { STEPS } from '../data/content';
import { link } from '../router';
import Reveal from '../components/Reveal';
import { Icon, WhatsAppIcon } from '../components/Icons';

export default function Steps() {
  return (
    <section id="pedir" className="relative overflow-hidden bg-brand py-20 text-ink sm:py-28">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow !text-ink">Cómo pedir</p>
          <h2 className="h-display mt-5 text-5xl lt:text-white sm:text-7xl lg:text-8xl">Pide en tres pasos</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110} v="up">
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-7 transition-transform duration-500 hover:-translate-y-2 sm:p-8">
                <span className="font-display text-8xl font-extrabold leading-none text-brand/30 transition-colors duration-500 group-hover:text-brand">{s.n}</span>
                <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-none">{s.t}</h3>
                <p className="mt-3 text-ink/65">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-10 flex flex-col items-start justify-between gap-6 steps-note rounded-[2rem] bg-ink p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <p className="flex max-w-xl items-start gap-3 text-white/80"><WhatsAppIcon className="mt-0.5 h-6 w-6 shrink-0 text-brand" />Domicilios únicamente por WhatsApp. No tomamos pedidos por mensaje directo de Instagram.</p>
          <a {...link('#/menu')} className="btn btn-green shrink-0">Hacer mi pedido<Icon name="arrow" className="h-4 w-4" /></a>
        </Reveal>
      </div>
    </section>
  );
}
