import { useRef } from 'react';
import Photo from './Photo';
import { CATS, PRODUCTS } from '../data';
import { scrollToTarget, useInView } from '../lib/scroll';

// Mosaico de categorías con fotos: cada tarjeta entra girando en 3D y lleva al catálogo filtrado
export default function Categories({ setCat }) {
  const ref = useRef(null);
  const seen = useInView(ref);
  const list = CATS.filter((c) => c.id !== 'todos');
  const go = (id) => { setCat(id); scrollToTarget('#catalogo'); };
  return (
    <section className="cats-sec">
      <div className="wrap py-[clamp(70px,9vw,110px)]">
        <div className="text-center">
          <p className="eyebrow justify-center">Explora</p>
          <h2 className="rv mask-up sec-title"><span>¿Qué quieres <em>consentir</em> hoy?</span></h2>
        </div>
        <div ref={ref} className={`bento ${seen ? 'in' : ''}`}>
          {list.map((c, i) => {
            const art = PRODUCTS.find((p) => p.cat === c.id)?.art;
            return (
              <button key={c.id} type="button" className={`bento-card b${i}`} style={{ '--k': i }} onClick={() => go(c.id)}>
                <Photo id={c.img} art={art} label={c.n} w={900} />
                <span className="bc-shade" />
                <span className="bc-txt"><b>{c.n}</b><em>{c.d}</em><i>{PRODUCTS.filter((p) => p.cat === c.id).length} productos →</i></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
