import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProductos, getResumenResenas } from '../api';
import { adaptProduct } from '../lib/product';
import Img from './Img';
import ProductCard from './ProductCard';

/**
 * Inicio · "Elegidas para ti": un adelanto del catálogo con las mismas tarjetas del catálogo.
 * Cuatro piezas (las mejor calificadas primero) y una tarjeta velada que invita a ver el resto.
 */
export default function Picks({ onAdd }) {
  const [data, setData] = useState(null);
  const nav = useNavigate();

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
        <div className="picks__grid">
          {!data
            ? Array.from({ length: 5 }, (_, k) => <div key={k} className="qcard"><div className="qcard__img"><span className="skel" /></div><div className="qcard__body" style={{ height: 84 }} /></div>)
            : (
              <>
                {items.map((p, k) => (
                  <ProductCard key={p.id} item={p} idx={k} rating={data.ratings[p.id]} onAdd={onAdd} onSelect={(x) => nav(`/catalogo?p=${x.id}`)} />
                ))}
                <Link to="/catalogo" className="qcard qcard--more" aria-label="Ver todo el catálogo">
                  <div className="qcard__img">
                    {data.velo && <Img src={data.velo.photos[0]} alt="" w={320} widths={[320]} sizes="23vw" />}
                    <span className="qcard__veil">
                      <b>{resto > 0 ? `+${resto}` : '+'}</b>
                      <span>{resto === 1 ? 'pieza más te espera' : 'piezas más te esperan'}</span>
                    </span>
                  </div>
                  <div className="qcard__body">
                    <h3>Ver todo el catálogo</h3>
                    <span className="qcard__go">Descubrir <ArrowRight size={16} /></span>
                  </div>
                </Link>
              </>
            )}
        </div>
      </div>
    </section>
  );
}
