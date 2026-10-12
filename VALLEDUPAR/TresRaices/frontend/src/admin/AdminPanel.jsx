import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../components/Icons';
import { obtenerCategoriasAdmin, obtenerDocumentosAdmin } from '../data/api';
import AdminDocumentForm from './AdminDocumentForm';
import AdminDocumentRow from './AdminDocumentRow';
import AdminToast from './AdminToast';

export default function AdminPanel({ token, usuario, onCerrarSesion, onSalir }) {
  const [categorias, setCategorias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  const notificar = (texto, tipo = 'ok') => {
    setToast({ texto, tipo });
    clearTimeout(notificar._t);
    notificar._t = setTimeout(() => setToast(null), 3200);
  };

  const cargar = useCallback(async () => {
    setError('');
    try {
      const [cats, docs] = await Promise.all([obtenerCategoriasAdmin(token), obtenerDocumentosAdmin(token)]);
      setCategorias(cats);
      setDocumentos(docs);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la información.');
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  const documentosFiltrados = filtro === 'todas' ? documentos : documentos.filter((d) => String(d.categoria_id) === filtro);

  return (
    <div className="admin-overlay fixed inset-0 z-[190] overflow-y-auto bg-cream">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="" className="h-9 w-9" draggable="false" />
            <div>
              <p className="font-display text-lg font-bold leading-tight text-forest">Panel administrativo</p>
              <p className="text-xs text-ink/55">{usuario?.nombre || usuario?.usuario}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onSalir} className="btn border border-ink/20 px-4 py-2 text-sm hover:bg-ink/5">
              Ver sitio
            </button>
            <button type="button" onClick={onCerrarSesion} className="btn bg-forest px-4 py-2 text-sm text-white hover:bg-ink">
              <Icon name="logout" className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        {error && <p role="alert" className="mb-6 rounded-xl bg-berry/10 px-4 py-3 text-sm font-medium text-berry-dark">{error}</p>}

        {cargando ? (
          <div className="grid place-items-center py-24 text-ink/50">Cargando…</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="order-2 space-y-3 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltro('todas')}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${filtro === 'todas' ? 'bg-forest text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:ring-leaf'}`}
                >
                  Todas ({documentos.length})
                </button>
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFiltro(String(c.id))}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${filtro === String(c.id) ? 'bg-forest text-white' : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:ring-leaf'}`}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>

              {documentosFiltrados.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-ink/20 bg-white px-5 py-10 text-center text-sm text-ink/55">
                  Todavía no hay documentos aquí.
                </p>
              ) : (
                <div className="space-y-3">
                  {documentosFiltrados.map((doc) => (
                    <AdminDocumentRow key={doc.id} token={token} doc={doc} categorias={categorias} onCambio={cargar} notificar={notificar} />
                  ))}
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <AdminDocumentForm token={token} categorias={categorias} onSubido={() => { cargar(); notificar('Documento subido.'); }} />
            </div>
          </div>
        )}
      </main>

      <AdminToast toast={toast} />
    </div>
  );
}
