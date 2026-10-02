import { useRef, useState } from 'react';
import { Icon } from '../components/Icons';
import { subirDocumento } from '../data/api';

const MAX_MB = 15;

export default function AdminDocumentForm({ token, categorias, onSubido }) {
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? '');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const inputArchivo = useRef(null);

  const reset = () => {
    setTitulo('');
    setDescripcion('');
    setArchivo(null);
    if (inputArchivo.current) inputArchivo.current.value = '';
  };

  const elegirArchivo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo supera ${MAX_MB} MB.`);
      e.target.value = '';
      return;
    }
    setError('');
    setArchivo(f);
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!categoriaId || !titulo.trim() || !archivo) {
      setError('Elige categoría, título y un archivo.');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('categoria_id', categoriaId);
      fd.append('titulo', titulo.trim());
      fd.append('descripcion', descripcion.trim());
      fd.append('archivo', archivo);
      await subirDocumento(token, fd);
      reset();
      onSubido();
    } catch (err) {
      setError(err.message || 'No se pudo subir el documento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-6">
      <p className="font-display text-lg font-bold text-forest">Subir documento</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Categoría</span>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Título</span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Acta de Asamblea 2026"
            className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold">Descripción (opcional)</span>
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold">Archivo (PDF, Word, Excel, JPG o PNG · máx. {MAX_MB} MB)</span>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/25 bg-cream px-4 py-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-white">
              <Icon name="upload" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-ink/70">{archivo ? archivo.name : 'Ningún archivo seleccionado'}</span>
            <label className="btn cursor-pointer border border-ink/20 bg-white px-4 py-2 text-sm hover:border-leaf">
              Elegir
              <input ref={inputArchivo} type="file" onChange={elegirArchivo} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" className="hidden" />
            </label>
          </div>
        </label>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-berry/10 px-3.5 py-2.5 text-sm font-medium text-berry-dark">{error}</p>}

      <button type="submit" disabled={enviando} className="btn mt-5 bg-leaf px-6 py-2.5 text-white hover:bg-forest disabled:opacity-70">
        {enviando ? 'Subiendo…' : 'Subir documento'} <Icon name="upload" className="h-4 w-4" />
      </button>
    </form>
  );
}
