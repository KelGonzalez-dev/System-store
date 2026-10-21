import { useEffect, useState } from 'react';
import { crearResena, getResenas } from '../api';
import Stars from './Stars';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fecha = (s) => { if (!s) return ''; const d = new Date(s); return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`; };

/** Reseñas de una mochila: promedio, barras por estrellas, lista y formulario para escribir una. */
export default function Reviews({ productId, productName }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(false);
  const [f, setF] = useState({ nombre: '', ciudad: '', calificacion: 0, comentario: '', web: '' });
  const [msg, setMsg] = useState(null);
  const [sending, setSending] = useState(false);

  const cargar = (p = 1) => getResenas(productId, p, 4)
    .then((d) => { setData((prev) => (p > 1 && prev ? { ...d, items: [...prev.items, ...d.items] } : d)); setPage(p); })
    .catch(() => setData((prev) => prev || { items: [], total: 0, promedio: 0, estrellas: {} }));
  useEffect(() => { cargar(1); }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const enviar = async (e) => {
    e.preventDefault();
    if (!f.calificacion) { setMsg({ t: 'err', m: 'Elige de 1 a 5 estrellas.' }); return; }
    setSending(true);
    setMsg(null);
    try {
      await crearResena(productId, f);
      setMsg({ t: 'ok', m: '¡Gracias! Tu reseña ya está publicada.' });
      setF({ nombre: '', ciudad: '', calificacion: 0, comentario: '', web: '' });
      setForm(false);
      cargar(1);
    } catch (err) {
      setMsg({ t: 'err', m: err?.response?.data?.error || 'No pudimos publicar tu reseña. Intenta de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  const total = data?.total || 0;
  return (
    <section className="reviews" aria-label="Reseñas">
      <div className="reviews__head">
        <h3>Reseñas</h3>
        {!form && <button type="button" className="btn btn--line btn--sm" onClick={() => { setForm(true); setMsg(null); }}>Escribir una reseña</button>}
      </div>

      {total > 0 && (
        <div className="reviews__sum">
          <div className="reviews__avg"><b>{Number(data.promedio).toFixed(1)}</b><Stars value={data.promedio} size={15} /><span>{total} {total === 1 ? 'reseña' : 'reseñas'}</span></div>
          <div className="reviews__bars">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = data.estrellas?.[n] || 0;
              return <div key={n}><span>{n}★</span><i><em style={{ width: `${total ? (c / total) * 100 : 0}%` }} /></i><small>{c}</small></div>;
            })}
          </div>
        </div>
      )}

      {msg && <p className={`reviews__msg ${msg.t}`}>{msg.m}</p>}

      {form && (
        <form className="rform" onSubmit={enviar}>
          <p className="rform__q">¿Qué te pareció la {productName}?</p>
          <Stars value={f.calificacion} size={28} onPick={(n) => setF({ ...f, calificacion: n })} label="Tu calificación" />
          <div className="rform__row">
            <input className="input" placeholder="Tu nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} maxLength={60} required />
            <input className="input" placeholder="Ciudad (opcional)" value={f.ciudad} onChange={(e) => setF({ ...f, ciudad: e.target.value })} maxLength={60} />
          </div>
          <textarea className="input" placeholder="Cuéntanos tu experiencia con la mochila" value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} maxLength={1000} required rows={4} />
          <input className="rform__trap" tabIndex={-1} autoComplete="off" value={f.web} onChange={(e) => setF({ ...f, web: e.target.value })} aria-hidden="true" />
          <div className="rform__foot">
            <button type="button" className="btn btn--line btn--sm" onClick={() => setForm(false)}>Cancelar</button>
            <button type="submit" className="btn btn--gold btn--sm" disabled={sending}>{sending ? 'Publicando…' : 'Publicar reseña'}</button>
          </div>
        </form>
      )}

      {data && total === 0 && !form && <p className="reviews__empty">Aún no hay reseñas. ¡Sé la primera en contarnos qué te pareció!</p>}

      <ul className="reviews__list">
        {data?.items.map((r) => (
          <li key={r.id}>
            <div className="rv-top"><Stars value={r.calificacion} size={13} /><time>{fecha(r.creadoEn)}</time></div>
            <p>{r.comentario}</p>
            <span className="rv-who">{r.nombre}{r.ciudad ? ` · ${r.ciudad}` : ''}</span>
          </li>
        ))}
      </ul>
      {data && data.items.length < total && <button type="button" className="reviews__more" onClick={() => cargar(page + 1)}>Ver más reseñas</button>}
    </section>
  );
}
