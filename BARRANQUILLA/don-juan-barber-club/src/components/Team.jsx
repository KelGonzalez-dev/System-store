import { useRef } from 'react';
import { CONFIG, L } from '../data';
import { useScrollFrame } from '../lib/scroll';

const STRIP = [L.barberoSonrisa, L.corteSede, L.barberoLocal, L.staff, L.capa, L.futbol, L.perfil, L.fade];

// "25": número gigante en 3D (capas doradas que dan volumen) que gira con el scroll, y una tira de fotos del equipo
export default function Team() {
  const sec = useRef(null);
  useScrollFrame(sec, (p) => { sec.current?.style.setProperty('--tp', p.toFixed(3)); });
  const strip = [...STRIP, ...STRIP];
  return (
    <section id="equipo" ref={sec} className="team">
      <div className="wrap team-grid py-[clamp(90px,11vw,150px)]">
        <div className="big25" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <span key={i} style={{ '--z': i }}>25</span>)}
        </div>
        <div className="team-copy">
          <p className="kicker">Los Don Juanes</p>
          <h2 className="rv mask-up sec-title"><span>Barberos <span className="gold-text">profesionales</span></span></h2>
          <p className="rv mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/70">Un equipo de 25 profesionales que domina desde el fade más limpio hasta la barba de revista. Formados, actualizados y con la mano que buscan los famosos.</p>
          <ul className="team-list rv">
            <li>Fades, French crop y cortes de tendencia</li>
            <li>Barba a navaja con toalla caliente</li>
            <li>Diseños, color y platinados</li>
            <li>Skincare y black mask</li>
          </ul>
          <a className="btn btn-glass mt-7" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Conocer a los Don Juanes</a>
        </div>
      </div>
      <div className="team-strip" aria-hidden="true">
        <div className="ts-track">{strip.map((src, i) => <figure key={i}><img src={src} alt="" loading="lazy" /></figure>)}</div>
      </div>
    </section>
  );
}
