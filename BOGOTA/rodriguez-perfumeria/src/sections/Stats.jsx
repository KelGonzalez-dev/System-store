import { STATS, waLink } from '../data/content';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import Photo from '../components/Photo';
import { WhatsAppIcon } from '../components/Icons';

export default function Stats() {
  return (
    <section id="nosotros" className="hairline relative overflow-hidden border-y bg-noir py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal v="left" className="lg:col-span-6">
          <div className="s3d-l relative">
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-70" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(212,175,106,.25), transparent 70%)' }} />
            <div className="hairline relative aspect-[4/3] overflow-hidden rounded-[2rem] border sm:aspect-[5/4]">
              <Photo k="shelf" w={1200} alt="Colección de perfumes" className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,4,3,.75), transparent 55%)' }} />
              <span className="absolute bottom-5 left-5 rounded-full border border-gold/60 bg-ink/70 px-4 py-2 font-cond text-[15px] font-bold uppercase tracking-[.16em] text-gold-light">Perfumería de autor</span>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">Por qué Rodriguez</p>
            <h2 className="h-display mt-5 text-6xl sm:text-8xl">Originales y <span className="glow-gold">asesoría real</span></h2>
            <p className="mt-6 max-w-md text-ivory/65">Cada perfume es original y llega bien empacado. Te ayudamos a elegir por WhatsApp, sin afán y sin compromiso.</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 120}>
                <p className="glow-ivory font-display text-5xl sm:text-7xl"><CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /></p>
                <p className="mt-2 font-cond text-[14px] font-semibold uppercase tracking-[.24em] text-ivory/55">{s.label}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <a href={waLink('Hola Rodriguez Perfumería, quiero asesoría para elegir mi perfume.')} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-10"><WhatsAppIcon className="h-5 w-5" />Hablar con un asesor</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
