import { useRef } from 'react';
import { Cupido, Nombre } from './Logo';
import { CONFIG, FOTOS } from '../data';
import { scrollToTarget, useScrollFrame } from '../lib/scroll';
import { abierto } from '../lib/horario';

const GENEROS = ['Rancheras', 'Despecho', 'Country', 'Popular', 'Baladas', 'Corridos', 'Boleros', 'Karaoke'];

/**
 * Hero: "Un saloon para cantarle al corazón". A la derecha, un disco de vinilo con el cupido en la etiqueta
 * gira en un tocadiscos; al hacer scroll gira más rápido y el brazo se acerca. Debajo, una cinta con los géneros.
 */
export default function Hero() {
  const sec = useRef(null);
  const disco = useRef(null);
  const rot = useRef(0);
  const ultimo = useRef(0);
  useScrollFrame(sec, (p, s) => {
    const v = Math.abs(s.y - ultimo.current);
    ultimo.current = s.y;
    rot.current += 0.6 + Math.min(18, v * 0.25);
    if (disco.current) disco.current.style.transform = `rotate(${rot.current % 360}deg)`;
    sec.current?.style.setProperty('--k', Math.min(1, Math.max(0, (p - 0.5) * 2)).toFixed(3));
  });
  const ab = abierto();
  return (
    <section id="inicio" ref={sec} className="hero">
      <Cupido className="hero__fantasma" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__estado intro" style={{ '--d': '.15s' }}><span className={`dot ${ab.abierto ? 'on' : ''}`} />{ab.texto}</p>
          <Nombre className="hero__nombre intro" />
          <h1 className="hero__h1">
            <span className="ln"><span style={{ '--i': 0 }}>Un saloon para</span></span>
            <span className="ln"><span style={{ '--i': 1 }}>cantarle al <em>corazón.</em></span></span>
          </h1>
          <p className="hero__p intro" style={{ '--d': '1s' }}>Sombreros, tequila, despecho y canciones para cantar a todo pulmón. Saloon sentimental en {CONFIG.direccion.split(', ').slice(1).join(', ')}.</p>
          <div className="hero__cta intro" style={{ '--d': '1.15s' }}>
            <button type="button" className="btn btn--coral" onClick={() => scrollToTarget('#reserva')}>Reservar mesa</button>
            <button type="button" className="btn btn--linea" onClick={() => scrollToTarget('#noches')}>Ver las noches</button>
          </div>
        </div>
        <div className="toca intro-pop" aria-hidden="true">
          <span className="polar p1"><img src={FOTOS.vaqueraRosa} alt="" /><em>sentimental ♥</em></span>
          <span className="polar p2"><img src={FOTOS.saloonLleno} alt="" /><em>sábado en el saloon</em></span>
          <span className="polar p3"><img src={FOTOS.caballo} alt="" /><em>yeehaw ✦</em></span>
          <span className="toca__base" />
          <div ref={disco} className="toca__disco">
            <span className="toca__surcos" />
            <span className="toca__etiqueta"><Cupido /><b>SALOON SENTIMENTAL</b></span>
          </div>
          <span className="toca__brazo"><i /></span>
          <span className="toca__chispa c1">✦</span><span className="toca__chispa c2">✦</span><span className="toca__chispa c3">✦</span>
        </div>
      </div>
      <div className="cinta" aria-hidden="true"><div>{[0, 1].map((k) => <span key={k}>{GENEROS.map((g) => <em key={g}>{g} ✦ </em>)}</span>)}</div></div>
    </section>
  );
}
