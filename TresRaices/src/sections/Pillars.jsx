import { PILLARS } from '../data/content';
import Reveal from '../components/Reveal';
import { Icon } from '../components/Icons';

export default function Pillars() {
  return (
    <section className="relative bg-cream py-14 sm:py-20">
      <div className="container-x grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} v="up" delay={i * 110} className="text-center lg:px-8 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-ink/15">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest text-white shadow-lg shadow-forest/25 transition-transform duration-500 hover:rotate-[8deg] hover:scale-110">
              <Icon name={p.icon} className="h-8 w-8" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-forest">{p.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-ink/80">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
