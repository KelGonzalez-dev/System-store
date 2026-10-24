import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { createCategoria, deleteCategoria, getCategorias, reordenarCategorias, updateCategoria } from '../api';

const SUGERIDAS = ['Mini', 'Mediana', 'Grande'];

/** Formulario de categoría: nombre y tallas (Mini, Mediana, Grande o las que se escriban). */
function CategoriaForm({ cat, onClose, onSaved }) {
  const [nombre, setNombre] = useState(cat?.nombre ?? '');
  const [tallas, setTallas] = useState(cat?.tallas ?? []);
  const [nueva, setNueva] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const toggle = (t) => setTallas((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]));
  const agregar = () => {
    const t = nueva.trim();
    if (t && !tallas.some((x) => x.toLowerCase() === t.toLowerCase())) setTallas([...tallas, t.charAt(0).toUpperCase() + t.slice(1)]);
    setNueva('');
  };
  const guardar = async (e) => {
    e.preventDefault();
    if (nombre.trim().length < 2) { setErr('Escribe el nombre de la categoría'); return; }
    setBusy(true);
    try {
      if (cat) await updateCategoria(cat.id, { nombre, tallas });
      else await createCategoria({ nombre, tallas });
      onSaved(cat ? 'Categoría actualizada' : 'Categoría creada');
      onClose();
    } catch (x) {
      setErr(x?.response?.data?.error || 'No se pudo guardar');
    } finally {
      setBusy(false);
    }
  };
  const quitadas = cat ? cat.tallas.filter((t) => !tallas.includes(t) && cat.porTalla?.[t]) : [];
  return (
    <div className="amodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <form className="amodal" onSubmit={guardar}>
        <h3>{cat ? 'Editar categoría' : 'Nueva categoría'}</h3>
        <label htmlFor="c-n">Nombre</label>
        <input id="c-n" className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Mochilas recamadas" autoFocus />
        <label>Tallas <small className="acat__hint">(opcional: si la categoría no tiene tallas, déjalas sin marcar)</small></label>
        <div className="acat__tallas">
          {[...new Set([...SUGERIDAS, ...tallas])].map((t) => (
            <button key={t} type="button" className={tallas.includes(t) ? 'on' : ''} onClick={() => toggle(t)}>{t}</button>
          ))}
        </div>
        <div className="acat__add">
          <input className="input" value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Otra talla (ej. Extra grande)" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregar(); } }} />
          <button type="button" className="btn btn--line btn--sm" onClick={agregar}>Agregar</button>
        </div>
        {quitadas.length > 0 && <p className="acat__aviso">Las mochilas con talla {quitadas.join(', ')} quedarán sin talla (siguen en la categoría).</p>}
        {err && <p className="amodal__err">{err}</p>}
        <div className="amodal__foot">
          <button type="button" className="btn btn--line" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn--gold" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}

/** Panel → Categorías: crear, editar, ordenar, ocultar y eliminar. */
export default function CategoriasAdmin({ toast, confirm, onChange }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const cargar = () => getCategorias().then(setData).catch(() => toast('Error cargando categorías', 'error'));
  useEffect(() => { cargar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const listo = (msg) => { toast(msg); cargar(); onChange?.(); };

  const mover = async (i, d) => {
    const ids = data.categorias.map((c) => c.id);
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setData({ ...data, categorias: ids.map((id) => data.categorias.find((c) => c.id === id)) });
    try { await reordenarCategorias(ids); onChange?.(); } catch { toast('No se pudo cambiar el orden', 'error'); cargar(); }
  };
  const visible = async (c) => {
    try { await updateCategoria(c.id, { activo: !c.activo }); listo(c.activo ? 'Categoría oculta en la tienda' : 'Categoría visible en la tienda'); } catch { toast('Error al actualizar', 'error'); }
  };
  const borrar = (c) => confirm(
    `¿Eliminar la categoría "${c.nombre}"? ${c.total ? `Sus ${c.total} mochilas NO se borran: quedan sin categoría.` : ''}`,
    async () => { try { await deleteCategoria(c.id); listo('Categoría eliminada'); } catch { toast('Error al eliminar', 'error'); } },
  );

  return (
    <>
      <div className="admin-panel-head">
        <h2>Categorías</h2>
        <button type="button" className="btn btn--gold btn--sm" onClick={() => setForm('new')}><Plus size={15} />Nueva categoría</button>
      </div>
      {!data ? (
        <p className="admin-empty">Cargando…</p>
      ) : (
        <>
          <ul className="acat">
            {data.categorias.map((c, i) => (
              <li key={c.id} className={c.activo ? '' : 'off'}>
                <div className="acat__order">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === data.categorias.length - 1} aria-label="Bajar"><ArrowDown size={14} /></button>
                </div>
                <div className="acat__body">
                  <b>{c.nombre}</b>{!c.activo && <em>Oculta</em>}
                  <span className="acat__meta">
                    {c.total} {c.total === 1 ? 'mochila' : 'mochilas'}
                    {c.tallas.length > 0 ? ` · Tallas: ${c.tallas.map((t) => `${t} (${c.porTalla?.[t] || 0})`).join(', ')}` : ' · Sin tallas'}
                  </span>
                </div>
                <div className="acat__act">
                  <button type="button" onClick={() => visible(c)} title={c.activo ? 'Ocultar en la tienda' : 'Mostrar en la tienda'}>{c.activo ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  <button type="button" onClick={() => setForm(c)} title="Editar"><Pencil size={15} /></button>
                  <button type="button" className="danger" onClick={() => borrar(c)} title="Eliminar"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
          {data.sinCategoria > 0 && <p className="acat__sin"><Tags size={15} /> Hay <b>{data.sinCategoria}</b> {data.sinCategoria === 1 ? 'mochila sin categoría' : 'mochilas sin categoría'}. Asígnales una desde <b>Productos → Editar</b>.</p>}
        </>
      )}
      {form && <CategoriaForm cat={form === 'new' ? null : form} onClose={() => setForm(null)} onSaved={listo} />}
    </>
  );
}

