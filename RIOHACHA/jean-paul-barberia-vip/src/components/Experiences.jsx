import { useState } from 'react';
import Photo from './Photo';
import { EXPERIENCES, fmt } from '../data';

/**
 * Experiencias en paneles que se expanden (acordeón horizontal): el elegido se abre a lo ancho
 * con su foto y su descripción; los demás quedan como columnas verticales con el nombre.
 * En celular, el acordeón es vertical.
 */
export default function Experiences({ onPick }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="experiencias" className="exp-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="sec-head">
          <div>
            <p className="eyebrow"><span className="dot" /> Experiencias</p>
            <h2 className="rv mask-up sec-title"><span>Elige tu <em>momento</em></span></h2>
          </div>
          <p className="rv sec-lead">Seis experiencias, un mismo cuidado. Toca una para conocerla y agéndala en un clic.</p>
        </div>
        <div className="exp">
          {EXPERIENCES.map((x, i) => (
            <article key={x.id} className={`ex ${open === i ? 'on' : ''}`} style={{ '--i': i }} onMouseEnter={() => setOpen(i)} onClick={() => setOpen(i)}>
              <Photo src={x.img} alt={x.t} w={1000} />
              <span className="ex-shade" />
              <span className="ex-n">0{i + 1}</span>
              <span className="ex-v">{x.n}</span>
              <div className="ex-body">
                <p className="ex-k">{x.n}</p>
                <h3>{x.t}</h3>
                <p className="ex-d">{x.d}</p>
                <div className="ex-foot">
                  <span>Desde <b>{fmt.format(x.from)}</b></span>
                  <button type="button" className="btn btn-gold !h-11" onClick={(e) => { e.stopPropagation(); onPick(x.id); }}>Agendar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
