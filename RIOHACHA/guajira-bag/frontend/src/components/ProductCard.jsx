import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import Img from './Img';
import Stars from './Stars';
import { fmt } from '../data';
import { useReveal } from '../hooks/useReveal';
import { productPath } from '../lib/seo';

/** Tarjeta de producto (catálogo e inicio): foto, "Pieza única", bolsa dorada para agregar, nombre y precio. */
export default function ProductCard({ item, idx = 0, rating, onSelect, onAdd }) {
  const ref = useReveal({ index: idx % 8 });
  const [added, setAdded] = useState(false);
  const add = (e) => { e.stopPropagation(); onAdd?.(item); setAdded(true); setTimeout(() => setAdded(false), 1400); };
  return (
    <article ref={ref} className="rv qcard" data-v="up" onClick={() => onSelect(item)}>
      <div className="qcard__img">
        <Img src={item.photos[0]} alt={`${item.name}${item.categoria ? ` — ${item.categoria.nombre}` : ' — mochila Wayuu'}${item.talla ? `, talla ${item.talla}` : ''}`} w={640} widths={[480, 640, 960]} sizes="(max-width: 700px) 48vw, (max-width: 1100px) 31vw, 23vw" eager={idx < 4} />
        <span className="qcard__tag">Pieza única</span>
        <button type="button" className={`qcard__bag${added ? ' ok' : ''}`} onClick={add} aria-label={`Agregar ${item.name} al carrito`}>
          {added ? <Check size={20} /> : <ShoppingBag size={20} />}
        </button>
      </div>
      <div className="qcard__body">
        <h3><a href={productPath(item)} onClick={(e) => e.preventDefault()}>{item.name}</a></h3>
        {rating?.total > 0 && <span className="qcard__rate"><Stars value={rating.promedio} size={12} /><small>({rating.total})</small></span>}
        <span className="qcard__price">{fmt(item.price)}{item.talla && <small className="qcard__size">{item.talla}</small>}</span>
      </div>
    </article>
  );
}
