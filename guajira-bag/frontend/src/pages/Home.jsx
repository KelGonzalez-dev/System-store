import { Link } from 'react-router-dom';
import Seo, { SITE_URL } from '../components/Seo';
import { useReveal } from '../hooks/useReveal';
import GalleryPreview from '../components/GalleryPreview';

const STRIP = ['Wayuu', 'Kankuama', 'Tejido a mano', 'La Guajira', 'Piezas únicas', 'Colombia'];

const H1 = [{ t: 'Delicadeza' }, { t: 'tejida' }, { t: 'a' }, { t: 'mano,' }, { t: 'para', g: 1 }, { t: 'ti', g: 1 }];
const PETALS = Array.from({ length: 20 }, (_, k) => ({ l: (k * 37 + 5) % 97, s: 11 + ((k * 5) % 10), d: 10 + ((k * 3) % 8), t: -((k * 1.3) % 16) }));

function Hero() {
  return (
    <section className="hero">
      <span className="hero__aura hero__aura--a" aria-hidden="true" />
      <span className="hero__aura hero__aura--b" aria-hidden="true" />
      <span className="hero__mark" aria-hidden="true">Guajira</span>
      <div className="hero__petals" aria-hidden="true">
        {PETALS.map((p, k) => <i key={k} style={{ left: `${p.l}%`, width: p.s, height: p.s * 1.35, animationDuration: `${p.d}s`, animationDelay: `${p.t}s` }} />)}
      </div>
      <div className="wrap hero__grid">
        <div>
          <span className="hero-in eyebrow hero__eyebrow" style={{ '--d': '300ms' }}>Artesanía Wayuu hecha con amor</span>
          <h1 className="h-display hero__title">
            {H1.map((w, n) => (
              <span key={n} className={`hw${w.g ? ' gold-text' : ''}`} style={{ '--d': `${480 + n * 110}ms` }}>{w.t}</span>
            ))}
            <svg className="hero__swirl" viewBox="0 0 300 20" fill="none" aria-hidden="true"><path d="M3 12C40 2 70 20 110 10s70-8 100 2 60 4 87-4" stroke="#d9b35e" strokeWidth="2" strokeLinecap="round" pathLength="1" /></svg>
          </h1>
          <p className="hero-in hero__lead" style={{ '--d': '1200ms' }}>
            Mochilas y bolsos artesanales creados por manos Wayuu y Kankuamas de La Guajira. Colores suaves, detalles únicos y la elegancia que te acompaña a todas partes.
          </p>
          <div className="hero-in hero__ctas" style={{ '--d': '1400ms' }}>
            <Link to="/catalogo" className="btn btn--gold btn--xl">Descubrir mi mochila</Link>
            <Link to="/galeria" className="btn btn--line btn--xl">Ver galería</Link>
          </div>
          <p className="hero-in hero__promise" style={{ '--d': '1600ms' }}>Tejido a mano · Cada pieza es única · Hecho con cariño</p>
        </div>

        <div className="hero__collage">
          <span className="hero__ring" aria-hidden="true" />
          <div className="hero__photo hero__photo--main">
            <img src="/images/mochila1.webp" alt="Mochila Wayuu tejida a mano" width="444" height="562" fetchpriority="high" />
          </div>
          <div className="hero__photo hero__photo--accent">
            <img src="/images/mochila2.webp" alt="Mochila Kankuama artesanal" width="408" height="612" />
          </div>
          <span className="hero__tag">Hecha con amor</span>
          <span className="hero__tag hero__tag--b">Pieza única</span>
        </div>
      </div>
    </section>
  );
}

function Strip() {
  const words = [...STRIP, ...STRIP];
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip__track">
        {[0, 1].map((k) => (
          <span key={k}>
            {words.map((w, i) => (
              <span key={`${k}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 46 }}>{w}<em /></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function Story() {
  const textRef = useReveal({ index: 0 });
  const imgRef = useReveal({ index: 1 });
  return (
    <section className="story">
      <div className="wrap story__grid">
        <div ref={textRef} className="rv" data-v="left">
          <span className="eyebrow">Nuestra historia</span>
          <h2 className="h-display">Tradición Wayuu<br /><span className="accent">en manos modernas</span></h2>
          <p>Guajira Bags nace del amor por la artesanía Wayuu y Kankuama. Cada mochila es tejida a mano por artesanas de La Guajira, combinando técnicas ancestrales con diseño contemporáneo.</p>
          <p>Nuestro compromiso es preservar la cultura indígena, apoyar a comunidades locales y crear piezas que inspiren elegancia, autenticidad y sostenibilidad.</p>
        </div>
        <div ref={imgRef} className="rv" data-v="right">
          <div className="story__photo">
            <img src="/images/galeria/galeria4.webp" alt="Artesanas Wayuu tejiendo mochilas en La Guajira" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { t: 'Elegancia que se nota', d: 'Diseños de mochilas y bolsos artesanales pensados para la mujer que quiere verse única, del día a la noche.' },
  { t: 'Calidad tejida a mano', d: 'Hilos resistentes, puntadas firmes y acabados cuidados por manos Wayuu y Kankuamas de La Guajira.' },
  { t: 'Mejor precio, sin intermediarios', d: 'Compras directo a Guajira Bags: valor justo para las artesanas y un precio que te hará decir “la quiero”.' },
  { t: 'Moda con cultura', d: 'Cada mochila lleva simbología ancestral. No es solo un accesorio: es una historia que estrenas.' },
];

function Why() {
  const ref = useReveal({});
  return (
    <section className="why">
      <div className="wrap">
        <div ref={ref} className="rv why__head" data-v="up">
          <h2 className="h-display">Mochilas Wayuu para mujer: moda, elegancia y calidad</h2>
          <p>En Guajira Bags encuentras mochilas artesanales, bolsos tejidos y accesorios de moda femenina hechos en La Guajira, Colombia. Pide por WhatsApp y recibe una pieza que nadie más va a tener.</p>
        </div>
        <div className="why__grid">
          {WHY.map((w) => (
            <article key={w.t} className="why__card"><h3>{w.t}</h3><p>{w.d}</p></article>
          ))}
        </div>
        <div className="why__cta"><Link to="/catalogo" className="btn btn--gold btn--xl">Elegir mi mochila ahora</Link></div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        path="/"
        title="Mochilas Wayuu para mujer: moda, elegancia y calidad tejida a mano"
        description="Guajira Bags: mochilas Wayuu y Kankuamas 100% artesanales, tejidas a mano en La Guajira, Colombia. Cultura Wayuu, tradición y diseño único. Pedidos por WhatsApp."
        keywords="guajira bags, mochilas para mujer, bolsos de mujer, moda femenina colombia, mochilas elegantes, mejor precio mochilas, mochilas de calidad, ropa y accesorios de mujer, mochilas wayuu, mochilas wayuu originales, cultura wayuu, mochilas kankuamas, mochilas artesanales colombia, wayuu bags, la guajira"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'Guajira Bags',
          image: `${SITE_URL}/images/logo-512.png`,
          description: 'Mochilas Wayuu y Kankuamas tejidas a mano en La Guajira, Colombia.',
          address: { '@type': 'PostalAddress', addressLocality: 'Riohacha', addressRegion: 'La Guajira', addressCountry: 'CO' },
          sameAs: ['https://www.instagram.com/guajira_bags/', 'https://www.tiktok.com/@.guajira.bags'],
        }}
      />
      <Hero />
      <Strip />
      <GalleryPreview />
      <Story />
      <Why />
    </>
  );
}
