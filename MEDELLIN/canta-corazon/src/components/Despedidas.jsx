import Foto from './Foto';
import Dibujo from './Dibujo';
import { DESPEDIDA, FOTOS, HERO_FOTO } from '../data';
import { scrollToTarget } from '../lib/scroll';

/** Despedidas de soltera (su destacado "Bride"): paquete y llamado a reservar. */
export default function Despedidas() {
  return (
    <section id="despedidas" className="desp">
      <div className="wrap desp__grid">
        <div className="desp__foto rv">
          <Foto id={HERO_FOTO} arte="novia" alt="Despedida de soltera en Canta Corazón" w={1000} />
          <span className="desp__banda">BRIDE ♥</span>
          <span className="desp__sombrero"><Dibujo tipo="sombrero" /></span>
          <span className="desp__mini m1"><img src={FOTOS.guante} alt="" /></span>
          <span className="desp__mini m2"><img src={FOTOS.brindis} alt="" /></span>
        </div>
        <div className="rv">
          <p className="eyebrow">Despedidas & cumpleaños</p>
          <h2 className="titulo">La última noche <em>de soltera</em> se canta aquí.</h2>
          <ul className="desp__lista">{DESPEDIDA.map((d) => <li key={d}>{d}</li>)}</ul>
          <button type="button" className="btn btn--coral" onClick={() => scrollToTarget('#reserva')}>Reservar mi despedida</button>
        </div>
      </div>
    </section>
  );
}
