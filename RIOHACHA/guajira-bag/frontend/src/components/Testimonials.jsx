import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crearResenaGeneral, getResenasRecientes } from '../api';
import { thumb } from '../config';
import Stars from './Stars';

const ETIQUETAS = ['', 'No me gustó', 'Regular', 'Está bien', '¡Me gustó!', '¡Me encantó!'];

/** Formulario para contar la experiencia con la tienda (sin elegir mochila). */
function Compartir({ onDone }) {
  const [f, setF] = useState({ nombre: '', ciudad: '', calificacion: 0, comentario: '', web: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const enviar = async (e) => {
    e.preventDefault();
    if (!f.calificacion) { setMsg({ t: 'err', m: 'Elige de 1 a 5 estrellas.' }); return; }
    setBusy(true);
    setMsg(null);
    try {
      await crearResenaGeneral(f);
      setMsg({ t: 'ok', m: '¡Gracias! Tu reseña ya está publicada.' });
      setF({ nombre: '', ciudad: '', calificacion: 0, comentario: '', web: '' });
      onDone();
    } catch (err) {
      setMsg({ t: 'err', m: err?.response?.data?.error || 'No pudimos publicar tu reseña. Intenta de nuevo.' });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="tst__form" onSubmit={enviar}>
      <h3>Comparte tu experiencia</h3>
      <p>Tu opinión ayuda a otras clientas a elegir su mochila.</p>
      <div className="tst__rate"><Stars value={f.calificacion} size={30} onPick={(n) => setF({ ...f, calificacion: n })} label="Tu calificación" /><em>{ETIQUETAS[f.calificacion]}</em></div>
      <div className="rform__row">
        <input className="input" placeholder="Tu nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} maxLength={60} required />
        <input className="input" placeholder="Ciudad (opcional)" value={f.ciudad} onChange={(e) => setF({ ...f, ciudad: e.target.value })} maxLength={60} />
      </div>
      <textarea className="input" rows={4} placeholder="Cuéntanos cómo te fue con tu mochila" value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} maxLength={1000} required />
      <input className="rform__trap" tabIndex={-1} autoComplete="off" value={f.web} onChange={(e) => setF({ ...f, web: e.target.value })} aria-hidden="true" />
      {msg && <p className={`reviews__msg ${msg.t}`}>{msg.m}</p>}
      <button type="submit" className="btn btn--gold" disabled={busy}>{busy ? 'Publicando…' : 'Publicar mi reseña'}</button>
    </form>
  );
}

/** Inicio · "Lo que dicen nuestras clientas": últimas reseñas 4–5★ y formulario para dejar una. */
export default function Testimonials() {
  const [data, setData] = useState(null);
  const [i, setI] = useState(0);
  const [form, setForm] = useState(false);
  const cargar = () => getResenasRecientes(8).then((d) => { setData(d); setI(0); }).catch(() => setData({ items: [], total: 0, promedio: 0 }));
  useEffect(() => { cargar(); }, []);
  const items = data?.items || [];
  useEffect(() => {
    if (items.length < 2) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);
  if (!data) return null;
  const r = items[i];
  return (
    <section className="tst">
      <div className="wrap tst__grid">
        <div className="tst__head">
          <span className="eyebrow">Reseñas</span>
          <h2 className="h-display">Lo que dicen nuestras <em>clientas</em></h2>
          {data.total > 0 && <div className="tst__score"><b>{Number(data.promedio).toFixed(1)}</b><div><Stars value={data.promedio} size={16} /><small>{data.total} {data.total === 1 ? 'reseña' : 'reseñas'}</small></div></div>}
          {!form && <button type="button" className="btn btn--line tst__cta" onClick={() => setForm(true)}>Escribir una reseña</button>}
        </div>
        {form ? (
          <Compartir onDone={() => { cargar(); setTimeout(() => setForm(false), 2200); }} />
        ) : r ? (
          <figure className="tst__card" key={r.id}>
            <span className="tst__q" aria-hidden="true">“</span>
            <Stars value={r.calificacion} size={16} />
            <blockquote>{r.comentario}</blockquote>
            <figcaption>
              {r.productoImagen && <img src={thumb(r.productoImagen, 160)} alt="" loading="lazy" />}
              <span>
                <b>{r.nombre}</b>{r.ciudad ? ` · ${r.ciudad}` : ''}
                {r.productoId ? <small>sobre <Link to={`/catalogo?p=${r.productoId}`}>{r.productoNombre}</Link></small> : <small>sobre su experiencia con Guajira Bags</small>}
              </span>
            </figcaption>
            {items.length > 1 && <div className="tst__dots">{items.map((x, k) => <button key={x.id} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Reseña ${k + 1}`} />)}</div>}
          </figure>
        ) : (
          <div className="tst__card tst__empty"><p>Aún no hay reseñas publicadas. ¡Sé la primera en contarnos tu experiencia!</p><button type="button" className="btn btn--gold" onClick={() => setForm(true)}>Escribir una reseña</button></div>
        )}
      </div>
    </section>
  );
}
