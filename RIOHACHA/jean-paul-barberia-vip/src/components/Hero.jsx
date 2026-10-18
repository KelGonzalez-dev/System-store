import { useEffect, useRef, useState } from 'react';
import { CONFIG, EXPERIENCES, L } from '../data';
import { dayLabel, nextDays } from '../lib/hours';
import { clamp, reducedMotion, useScrollFrame } from '../lib/scroll';

const DECK = [L.salon, L.fade, L.lobby, L.facial, L.spa];
const WORDS = ['experiencia', 'actitud', 'elegancia', 'personalidad'];

/**
 * Hero "Agenda VIP": titular editorial con una palabra que cambia, un mazo de fotos reales
 * que se baraja solo en 3D (la de adelante se va al fondo) y un mini-agendador:
 * eliges servicio y día, y el concierge te espera abajo con eso ya respondido.
 */
export default function Hero({ onQuick }) {
  const sec = useRef(null);
  const [top, setTop] = useState(0);
  const [w, setW] = useState(0);
  const [svc, setSvc] = useState('cortes');
  const days = useRef(nextDays(4)).current;
  const [day, setDay] = useState(days[0]?.key);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--k', clamp((p - 0.5) / 0.5).toFixed(3)); });
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const a = setInterval(() => setTop((x) => (x + 1) % DECK.length), 3200);
    const b = setInterval(() => setW((x) => (x + 1) % WORDS.length), 2600);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <section id="inicio" ref={sec} className="hero">
      <div className="hero-bg" aria-hidden="true"><span className="hb-slats" /><span className="hb-glow" /></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow intro" style={{ '--d': '0.1s' }}><span className="dot" /> Barbería VIP · {CONFIG.city.split(',')[0]}</p>
          <h1 className="hero-h1">
            <span className="hl"><span className="hl-in" style={{ '--i': 0 }}>Más que un corte,</span></span>
            <span className="hl"><span className="hl-in" style={{ '--i': 1 }}>una <span className="rot" aria-live="polite"><span key={w} className="rot-w">{WORDS[w]}</span></span></span></span>
          </h1>
          <p className="hero-p intro" style={{ '--d': '0.9s' }}>Cortes, barba, facial, spa masculino y uñas en un salón con sillones de cuero, luz cálida y atención de verdad. Elegancia para grandes, cariño para pequeños.</p>
          <form className="quick intro" style={{ '--d': '1.1s' }} onSubmit={(e) => { e.preventDefault(); onQuick({ svc, day }); }}>
            <div className="q-row">
              <span className="q-lbl">¿Qué te hacemos?</span>
              <div className="q-chips">{EXPERIENCES.map((x) => <button key={x.id} type="button" className={svc === x.id ? 'on' : ''} onClick={() => setSvc(x.id)}>{x.n}</button>)}</div>
            </div>
            <div className="q-row">
              <span className="q-lbl">¿Cuándo?</span>
              <div className="q-chips">{days.map((x) => <button key={x.key} type="button" className={day === x.key ? 'on' : ''} onClick={() => setDay(x.key)}>{dayLabel(x)}</button>)}</div>
            </div>
            <button type="submit" className="btn btn-gold q-go">Agendar mi cita <span aria-hidden="true">→</span></button>
          </form>
        </div>
        <div className="deck intro-pop" aria-hidden="true">
          {DECK.map((src, i) => {
            const pos = (i - top + DECK.length) % DECK.length;
            return <figure key={src} className="dk" style={{ '--p': pos, zIndex: DECK.length - pos }}><img src={src} alt="" loading={i < 2 ? 'eager' : 'lazy'} /></figure>;
          })}
          <div className="deck-badge"><b>VIP</b><span>Sillones de cuero · luz cálida · atención personal</span></div>
        </div>
      </div>
      <div className="hero-foot wrap intro" style={{ '--d': '1.3s' }}>
        <span>✂ Cortes</span><span>🪒 Barba</span><span>✨ Facial</span><span>💆 Spa masculino</span><span>💅 Uñas</span><span>🧒 Niños</span>
      </div>
    </section>
  );
}
