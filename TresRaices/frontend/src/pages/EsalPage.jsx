import { useEffect, useState } from 'react';
import { obtenerDocumentosPublicos, urlDescarga } from '../data/api';
import { Icon } from '../components/Icons';
import { BRAND } from '../data/content';

const ACENTOS = ['#c90e1e', '#df8b10', '#75a32a'];

const formatoTamano = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function EsalPage() {
  const [estado, setEstado] = useState('cargando');
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    obtenerDocumentosPublicos()
      .then((docs) => {
        setDocumentos(docs);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  const agrupados = documentos.reduce((acc, d) => {
    (acc[d.categoria_nombre] ||= []).push(d);
    return acc;
  }, {});
  const categorias = Object.keys(agrupados);

  return (
    <div className="min-h-screen bg-cream">
      <header className="relative overflow-hidden bg-forest text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-leaf/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="container-x relative flex flex-col items-center gap-4 py-14 text-center sm:py-20">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-cream p-3 shadow-lg">
            <img src="/logo.webp" alt={BRAND.name} className="h-full w-full object-contain" />
          </div>
          <h1 className="h-display text-4xl sm:text-5xl">Documentos ESAL</h1>
          <p className="max-w-xl text-white/80">
            {BRAND.legal} · <span className="font-semibold">{BRAND.sigla}</span>
          </p>
          <p className="max-w-xl text-sm text-white/60">Documentación pública para transparencia y trazabilidad de la cooperativa.</p>
        </div>
      </header>

      <main className="container-x py-12 sm:py-16">
        {estado === 'cargando' && <p className="py-16 text-center text-ink/50">Cargando documentos…</p>}
        {estado === 'error' && <p className="py-16 text-center text-ink/50">No se pudieron cargar los documentos. Intenta de nuevo más tarde.</p>}
        {estado === 'listo' && categorias.length === 0 && <p className="py-16 text-center text-ink/50">Aún no hay documentos publicados.</p>}

        {estado === 'listo' && categorias.length > 0 && (
          <div className="space-y-12">
            {categorias.map((nombre, i) => (
              <section key={nombre}>
                <h2 className="font-display text-2xl font-bold text-forest">{nombre}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {agrupados[nombre].map((doc) => (
                    <a
                      key={doc.id}
                      href={urlDescarga(doc.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ borderLeft: `4px solid ${ACENTOS[i % ACENTOS.length]}` }}
                    >
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                        <Icon name="file" className="h-6 w-6" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display font-bold text-ink">{doc.titulo}</span>
                        {doc.descripcion && <span className="mt-0.5 block truncate text-sm text-ink/60">{doc.descripcion}</span>}
                        <span className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-leaf">
                          Descarga
                          {formatoTamano(doc.tamano_bytes) && <span className="text-ink/40">· {formatoTamano(doc.tamano_bytes)}</span>}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-ink/10 py-6 text-center text-xs text-ink/50">
        <a href="/" className="font-semibold text-leaf hover:underline">Volver al sitio de {BRAND.name}</a>
      </footer>
    </div>
  );
}
