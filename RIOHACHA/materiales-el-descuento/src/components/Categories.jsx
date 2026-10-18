import { useRef } from 'react';
import Art from './Art';
import Photo from './Photo';
import { CATS, PRODUCTS } from '../data';
import { useInView } from '../lib/scroll';

// Categorías: tarjetas con foto e ilustración; al tocar, filtra el catálogo
export default function Categories({ onCat }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  return (
    <section id="categorias" className="sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker">Categorías</p><h2 className="sec-title">Encuentra lo que tu obra necesita</h2></div>
          <p className="sec-lead">{CATS.length} categorías, {PRODUCTS.length}+ productos de ejemplo y precios al detal y al por mayor.</p>
        </div>
        <div ref={ref} className={`cat-grid ${seen ? 'in' : ''}`}>
          {CATS.map((c, i) => (
            <button key={c.id} type="button" className="cat-card" style={{ '--k': i }} onClick={() => onCat(c.id)}>
              <Photo src={c.img} art={c.art} alt={c.n} w={500} />
              <span className="cc-shade" />
              <span className="cc-art"><Art art={c.art} /></span>
              <span className="cc-txt"><b>{c.n}</b><small>{c.d}</small><em>{PRODUCTS.filter((p) => p.cat === c.id).length} productos →</em></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
