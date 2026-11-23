import { CORTES, fmt } from '../data';

/** Cortes de la casa: el corte insignia con foto y los demás en tarjetas sobrias. */
export default function Cortes() {
  const [insignia, ...resto] = CORTES;
  return (
    <section id="cortes" className="cortes">
      <div className="wrap">
        <div className="cabeza rv">
          <p className="sobre">Selección de la casa</p>
          <h2 className="titulo">Nuestros cortes</h2>
          <span className="filete filete--centro" />
          <p className="cabeza__p">Asados al carbón y servidos en su punto, con un acompañamiento a elección.</p>
        </div>
        <article className="insignia rv">
          <div className="insignia__txt">
            <span className="sobre">Corte insignia</span>
            <h3>{insignia.nombre}</h3>
            <span className="cortes__g">{insignia.gramos}</span>
            <p>{insignia.txt}</p>
            <b className="cortes__precio">{fmt(insignia.precio)}</b>
          </div>
        </article>
        <div className="cortes__grid">
          {resto.map((c) => (
            <article key={c.nombre} className="corte rv">
              <div className="corte__cab"><h3>{c.nombre}</h3><span className="cortes__g">{c.gramos}</span></div>
              <p>{c.txt}</p>
              <b className="cortes__precio">{fmt(c.precio)}</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
