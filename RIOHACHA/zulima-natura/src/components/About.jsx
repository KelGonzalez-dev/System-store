import { Logo, Monogram } from './Brand';
import Photo from './Photo';
import { CONFIG, MOOD, waLink } from '../data';
import { scrollToTarget } from '../lib/scroll';

const STEPS = [
  ['Elige', 'Explora el catálogo y agrega a tu bolsa lo que te guste.'],
  ['Envía', 'Me mandas el pedido por WhatsApp con un solo toque.'],
  ['Recibe', 'Te confirmo, pagas como prefieras y te lo llevo.'],
];

export function About() {
  return (
    <section id="zulima" className="about-sec">
      <div className="wrap grid items-center gap-12 py-[clamp(80px,10vw,120px)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="about-portrait rv" aria-hidden="true">
          <div className="ap-ring" />
          <div className="ap-photo"><Photo id={MOOD.about} w={800} /></div>
          <div className="ap-card"><Monogram /><span>Zulima</span></div>
          <span className="ap-leaf a1">❦</span><span className="ap-leaf a2">❦</span>
        </div>
        <div>
          <p className="eyebrow">Hola, soy Zulima</p>
          <h2 className="rv mask-up sec-title"><span>Tu consultora de <em>belleza</em></span></h2>
          <p className="rv mt-4 max-w-[52ch] text-[17px] leading-relaxed text-bosque/80">Soy consultora de belleza Natura y me encanta ayudarte a encontrar el perfume, la crema o el regalo perfecto. Te asesoro con cariño, te cuento las novedades de cada ciclo y te llevo tus productos hasta la puerta.</p>
          <div className="steps">
            {STEPS.map(([t, d], i) => <div key={t} className="step rv" style={{ '--i': i }}><span>{i + 1}</span><b>{t}</b><p>{d}</p></div>)}
          </div>
          <div className="pays"><b>Formas de pago:</b> {CONFIG.payments.join(' · ')}</div>
          <p className="mt-2 text-[14px] text-bosque/70">{CONFIG.delivery}.</p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap flex flex-col items-center py-14 text-center">
        <Logo />
        <p className="foot-quote">Belleza natural para ti</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a className="btn btn-terra" href={waLink('¡Hola Zulima! 🌿 Quiero información de los productos Natura.')} target="_blank" rel="noopener noreferrer">Escríbeme por WhatsApp</a>
          {CONFIG.instagram && <a className="btn btn-line" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">@{CONFIG.instagram}</a>}
        </div>
        <p className="mt-8 max-w-[60ch] text-[12px] text-bosque/55">Consultora independiente de belleza Natura · {CONFIG.city}. Natura y los nombres de sus productos son marcas de su respectivo titular. Precios sujetos al ciclo vigente.</p>
        <a href="#inicio" className="mt-4 text-[12px] font-semibold text-bosque/60 ulink" onClick={(e) => { e.preventDefault(); scrollToTarget('body'); }}>Volver arriba ↑</a>
      </div>
    </footer>
  );
}
