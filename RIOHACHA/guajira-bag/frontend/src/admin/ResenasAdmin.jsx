import { useEffect, useState } from 'react';
import { Eye, EyeOff, Pencil, Search, Trash2 } from 'lucide-react';
import { deleteResena, getResenasAdmin, updateResena } from '../api';
import { thumb } from '../config';
import Stars from '../components/Stars';
import { fecha } from '../components/Reviews';

function Editar({ r, onClose, onSaved }) {
  const [f, setF] = useState({ nombre: r.nombre, ciudad: r.ciudad || '', calificacion: r.calificacion, comentario: r.comentario });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const guardar = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await updateResena(r.id, f); onSaved('Reseña actualizada'); onClose(); } catch (x) { setErr(x?.response?.data?.error || 'No se pudo guardar'); } finally { setBusy(false); }
  };
  return (
    <div className="amodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <form className="amodal" onSubmit={guardar}>
        <h3>Editar reseña</h3>
        <p className="ares__prod">{r.productoId ? (r.productoNombre || 'Producto eliminado') : 'Reseña de la tienda'}</p>
        <label>Calificación</label>
        <Stars value={f.calificacion} size={26} onPick={(n) => setF({ ...f, calificacion: n })} label="Calificación" />
        <label htmlFor="r-n">Nombre</label>
        <input id="r-n" className="input" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
        <label htmlFor="r-c">Ciudad</label>
        <input id="r-c" className="input" value={f.ciudad} onChange={(e) => setF({ ...f, ciudad: e.target.value })} />
        <label htmlFor="r-t">Comentario</label>
        <textarea id="r-t" className="input" value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value })} />
        {err && <p className="amodal__err">{err}</p>}
        <div className="amodal__foot">
          <button type="button" className="btn btn--line" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--gold" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}

/** Panel → Reseñas: buscar, filtrar por visibles/ocultas, ocultar, editar y eliminar. */
export default function ResenasAdmin({ toast, confirm }) {
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [vis, setVis] = useState('todas');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, totalPaginas: 1 });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);

  useEffect(() => { const t = setTimeout(() => { setDq(q.trim()); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const cargar = () => {
    setLoading(true);
    getResenasAdmin({ pagina: page, porPagina: 20, visible: vis, buscar: dq || undefined })
      .then(setData).catch(() => toast('Error cargando reseñas', 'error')).finally(() => setLoading(false));
  };
  useEffect(cargar, [page, vis, dq]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = async (r) => {
    try { await updateResena(r.id, { visible: !r.visible }); toast(r.visible ? 'Reseña ocultada' : 'Reseña visible'); cargar(); } catch { toast('Error al actualizar', 'error'); }
  };
  const borrar = (r) => confirm(`¿Eliminar la reseña de ${r.nombre}? No se puede deshacer.`, async () => {
    try { await deleteResena(r.id); toast('Reseña eliminada'); cargar(); } catch { toast('Error al eliminar', 'error'); }
  });

  return (
    <>
      <div className="admin-panel-head">
        <h2>Reseñas <small className="ares__count">{data.total}</small></h2>
        <div className="ares__tools">
          <label className="ares__search"><Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, texto o mochila" /></label>
          <div className="ares__chips">
            {[['todas', 'Todas'], ['1', 'Visibles'], ['0', 'Ocultas']].map(([k, l]) => (
              <button key={k} type="button" className={vis === k ? 'on' : ''} onClick={() => { setVis(k); setPage(1); }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      {loading ? (
        <p className="admin-empty">Cargando…</p>
      ) : data.items.length === 0 ? (
        <p className="admin-empty">No hay reseñas {vis === '0' ? 'ocultas' : ''} {dq ? 'con esa búsqueda' : 'todavía'}.</p>
      ) : (
        <ul className="ares">
          {data.items.map((r) => (
            <li key={r.id} className={r.visible ? '' : 'off'}>
              {r.productoImagen ? <img src={thumb(r.productoImagen, 160)} alt="" loading="lazy" /> : <span className="ares__noimg" />}
              <div className="ares__body">
                <div className="ares__top"><Stars value={r.calificacion} size={13} /><time>{fecha(r.creadoEn)}</time>{!r.visible && <em>Oculta</em>}</div>
                <p className="ares__txt">{r.comentario}</p>
                <p className="ares__who"><b>{r.nombre}</b>{r.ciudad ? ` · ${r.ciudad}` : ''} — <span>{r.productoId ? (r.productoNombre || 'Producto eliminado') : 'Reseña de la tienda'}</span></p>
              </div>
              <div className="ares__act">
                <button type="button" onClick={() => toggle(r)} title={r.visible ? 'Ocultar' : 'Mostrar'}>{r.visible ? <EyeOff size={15} /> : <Eye size={15} />}<span>{r.visible ? 'Ocultar' : 'Mostrar'}</span></button>
                <button type="button" onClick={() => setEdit(r)} title="Editar"><Pencil size={15} /><span>Editar</span></button>
                <button type="button" className="danger" onClick={() => borrar(r)} title="Eliminar"><Trash2 size={15} /><span>Eliminar</span></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {data.totalPaginas > 1 && (
        <div className="admin-pager">
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          <span>Página {page} de {data.totalPaginas}</span>
          <button type="button" disabled={page === data.totalPaginas} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
      {edit && <Editar r={edit} onClose={() => setEdit(null)} onSaved={(m) => { toast(m); cargar(); }} />}
    </>
  );
}
