import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { getProductos, getResumenResenas } from '../api';
import { adaptProduct } from '../lib/product';
import { fmt } from '../data';
import Img from './Img';
import Stars from './Stars';

/**
 * Inicio · "Elegidas para ti": un adelanto del catálogo, no el catálogo completo.
 * Una pieza protagonista (la mejor calificada), tres piezas más y una tarjeta velada
 * que invita a descubrir el resto ("+27 piezas te esperan").
 */
export default function Picks({ onAdd }) {
  const [data, setData] = useState(null);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    getProductos(1, 8, true, { orden: 'recientes' })
      .then(async (d) => {
        const list = (d.items || []).map(adaptProduct);
        let r = {};
        try { r = (await getResumenResenas(list.map((x) => x.id))) || {}; } catch { /* sin reseñas */ }
        const score = (x) => (r[x.id]?.total ? r[x.id].promedio * 10 + Math.min(r[x.id].total, 10) : 0);
        const orden = [...list].sort((a, b) => score(b) - score(a));
        setData({ items: orden.slice(0, 4), velo: orden[4] || orden[0], total: d.total || list.length, ratings: r });
      })
      .catch(() => setData({ items: [] }));
  }, []);

  if (data && data.items.length === 0) return null;
  const items = data?.items || [];
  const resto = Math.max(0, (data?.total || 0) - items.length);
  const add = (p) => { onAdd?.(p); setAdded(p.id); setTimeout(() => setAdded(null), 1400); };

  const Tarjeta = ({ p, grande }) => (
    <article className={`pk${grande ? ' pk--big' : ''}`}>
      <Link to={`/catalogo?p=${p.id}`} className="pk__arch" aria-label={`Ver ${p.name}`}>
        <Img src={p.photos[0]} alt={p.name} w={grande ? 960 : 480} widths={grande ? [640, 960] : [320, 480]} sizes={grande ? '(max-width: 700px) 92vw, 46vw' : '(max-width: 700px) 46vw, 22vw'} />
        {p.photos[1] && <Img src={p.photos[1]} alt="" w={grande ? 960 : 480} widths={grande ? [640, 960] : [320, 480]} sizes={grande ? '46vw' : '22vw'} className="pk__b" />}
        {grande && <span className="pk__badge">La favorita</span>}
      </Link>
      <button type="button" className={`pk__add${added === p.id ? ' ok' : ''}`} onClick={() => add(p)} aria-label={`Agregar ${p.name} al carrito`}>
        {added === p.id ? '✓' : <Plus size={18} />}
      </button>
      <Link to={`/catalogo?p=${p.id}`} className="pk__info">
        <h3>{p.name}</h3>
        {data.ratings[p.id]?.total > 0 && <span className="pk__rate"><Stars value={data.ratings[p.id].promedio} size={12} /><small>({data.ratings[p.id].total})</small></span>}
        <b>{fmt(p.price)}</b>
      </Link>
    </article>
  );

  return (
    <section className="picks">
      <div className="wrap">
        <div className="picks__head">
          <div>
            <span className="eyebrow">Un adelanto del catálogo</span>
            <h2 className="h-display">Elegidas <em>para ti</em></h2>
          </div>
          <p>Las favoritas de nuestras clientas. Cada una es única: cuando se va, no vuelve igual.</p>
        </div>
        {!data ? (
          <div className="picks__grid">{Array.from({ length: 5 }, (_, k) => <div key={k} className={`pk pk--skel${k === 0 ? ' pk--big' : ''}`}><span className="pk__arch"><span className="skel" /></span></div>)}</div>
        ) : (
          <div className="picks__grid">
            <Tarjeta p={items[0]} grande />
            {items.slice(1).map((p) => <Tarjeta key={p.id} p={p} />)}
            <Link to="/catalogo" className="pk pk--more" aria-label="Ver todo el catálogo">
              <span className="pk__arch">
                {data.velo && <Img src={data.velo.photos[0]} alt="" w={320} widths={[320]} sizes="22vw" />}
                <span className="pk__veil">
                  <b>{resto > 0 ? `+${resto}` : '+'}</b>
                  <span>{resto === 1 ? 'pieza más te espera' : 'piezas más te esperan'}</span>
                  <em>Ver el catálogo <ArrowRight size={15} /></em>
                </span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
