import { useState } from 'react';
import { Icon } from '../components/Icons';
import { actualizarDocumento, eliminarDocumento, urlDescarga } from '../data/api';

const formatoTamano = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDocumentRow({ token, doc, categorias, onCambio, notificar }) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(doc.titulo);
  const [descripcion, setDescripcion] = useState(doc.descripcion || '');
  const [categoriaId, setCategoriaId] = useState(doc.categoria_id);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    try {
      await actualizarDocumento(token, doc.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria_id: categoriaId,
        visible: doc.visible,
        orden: doc.orden,
      });
      setEditando(false);
      onCambio();
      notificar('Documento actualizado.');
    } catch (err) {
      notificar(err.message || 'No se pudo actualizar.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const alternarVisible = async () => {
    try {
      await actualizarDocumento(token, doc.id, {
        titulo: doc.titulo,
        descripcion: doc.descripcion || '',
        categoria_id: doc.categoria_id,
        visible: doc.visible ? 0 : 1,
        orden: doc.orden,
      });
      onCambio();
    } catch (err) {
      notificar(err.message || 'No se pudo cambiar la visibilidad.', 'error');
    }
  };

  const borrar = async () => {
    setEliminando(true);
    try {
      await eliminarDocumento(token, doc.id);
      onCambio();
      notificar('Documento eliminado.');
    } catch (err) {
      notificar(err.message || 'No se pudo eliminar.', 'error');
      setEliminando(false);
    }
  };

  if (editando) {
    return (
      <div className="rounded-2xl border border-leaf/40 bg-lime/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-leaf focus:outline-none" />
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-leaf focus:outline-none">
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-leaf focus:outline-none sm:col-span-2" />
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={guardar} disabled={guardando} className="btn bg-leaf px-4 py-2 text-sm text-white hover:bg-forest disabled:opacity-70">
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" onClick={() => setEditando(false)} className="btn border border-ink/20 px-4 py-2 text-sm hover:bg-ink/5">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors sm:flex-row sm:items-center ${doc.visible ? 'border-ink/10 bg-white' : 'border-ink/10 bg-ink/[.03]'}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
        <Icon name="file" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{doc.titulo}</p>
        <p className="truncate text-xs text-ink/55">
          {doc.categoria_nombre} · {formatoTamano(doc.tamano_bytes)} · {doc.descargas} descarga{doc.descargas === 1 ? '' : 's'}
          {!doc.visible && ' · oculto'}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <a href={urlDescarga(doc.id)} target="_blank" rel="noopener noreferrer" aria-label="Ver documento" className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-forest">
          <Icon name="file" className="h-4 w-4" />
        </a>
        <button type="button" onClick={alternarVisible} aria-label={doc.visible ? 'Ocultar' : 'Mostrar'} className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-forest">
          <Icon name={doc.visible ? 'toggle' : 'toggleOff'} className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => setEditando(true)} aria-label="Editar" className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-forest">
          <Icon name="edit" className="h-4 w-4" />
        </button>
        {confirmarBorrado ? (
          <button type="button" onClick={borrar} disabled={eliminando} className="btn bg-berry px-3 py-1.5 text-xs text-white hover:bg-berry-dark disabled:opacity-70">
            {eliminando ? '…' : 'Confirmar'}
          </button>
        ) : (
          <button type="button" onClick={() => setConfirmarBorrado(true)} aria-label="Eliminar" className="grid h-9 w-9 place-items-center rounded-full text-ink/60 hover:bg-berry/10 hover:text-berry">
            <Icon name="trash" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
