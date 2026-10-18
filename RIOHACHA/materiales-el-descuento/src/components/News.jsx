import { useEffect, useState } from 'react';
import Photo from './Photo';
import { NEWS } from '../data';
import { lockScroll } from '../lib/scroll';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fdate = (s) => { const [y, m, d] = s.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

// Noticias y consejos: filtro por etiqueta y lectura en ventana
export default function News() {
  const tags = ['Todas', ...new Set(NEWS.map((n) => n.tag))];
  const [tag, setTag] = useState('Todas');
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const k = (e) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', k);
    return () => { lockScroll(false); document.removeEventListener('keydown', k); };
  }, [open]);
  const list = NEWS.filter((n) => tag === 'Todas' || n.tag === tag);
  const [first, ...rest] = list;
  return (
    <section id="noticias" className="sec news-sec">
      <div className="wrap">
        <div className="sec-head">
          <div><p className="kicker">Noticias y consejos</p><h2 className="sec-title">Lo nuevo en El Descuento</h2></div>
          <div className="tags">{tags.map((t) => <button key={t} type="button" className={tag === t ? 'on' : ''} onClick={() => setTag(t)}>{t}</button>)}</div>
        </div>
        {first && (
          <div className="news-grid">
            <article className="news big" onClick={() => setOpen(first)}>
              <div className="nw-img"><Photo src={first.img} w={900} alt="" /></div>
              <div className="nw-body"><span className="nw-tag">{first.tag}</span><time>{fdate(first.date)}</time><h3>{first.t}</h3><p>{first.d}</p><em>Leer más →</em></div>
            </article>
            <div className="news-list">
              {rest.map((n) => (
                <article key={n.id} className="news" onClick={() => setOpen(n)}>
                  <div className="nw-img"><Photo src={n.img} w={400} alt="" /></div>
                  <div className="nw-body"><span className="nw-tag">{n.tag}</span><time>{fdate(n.date)}</time><h3>{n.t}</h3><em>Leer más →</em></div>
                </article>
              ))}
            </div>
          </div>
        )}
        <p className="demo-note">⚠️ Noticias de ejemplo: se publican y editan en <code>src/data.js</code>.</p>
      </div>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={open.t} onClick={() => setOpen(null)}>
          <article className="article" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="md-close" onClick={() => setOpen(null)} aria-label="Cerrar">✕</button>
            <div className="ar-img"><Photo src={open.img} w={1000} alt="" /></div>
            <div className="ar-body"><span className="nw-tag">{open.tag}</span><time>{fdate(open.date)}</time><h3>{open.t}</h3><p className="ar-lead">{open.d}</p><p>{open.body}</p></div>
          </article>
        </div>
      )}
    </section>
  );
}
