import { useEffect, useState } from 'react';
import { obtenerDocumentosPublicos, urlDescarga } from '../data/api';
import { Icon } from './Icons';

export default function PublicEsalDocs() {
  const [abierto, setAbierto] = useState(false);
  const [estado, setEstado] = useState('inactivo');
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    if (!abierto || estado !== 'inactivo') return;
    setEstado('cargando');
    obtenerDocumentosPublicos()
      .then((docs) => {
        setDocumentos(docs);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, [abierto, estado]);

  const agrupados = documentos.reduce((acc, d) => {
    (acc[d.categoria_nombre] ||= []).push(d);
    return acc;
  }, {});

  return (
    <div className="border-t border-white/10">
      <div className="container-x py-6">
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <Icon name="file" className="h-5 w-5 text-lime" /> Documentos y transparencia (ESAL)
          </span>
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 transition-transform duration-300 ${abierto ? 'rotate-45' : ''}`}>
            <Icon name="plus" className="h-4 w-4 text-white/70" />
          </span>
        </button>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${abierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="pt-5">
              {estado === 'cargando' && <p className="text-sm text-white/60">Cargando documentos…</p>}
              {estado === 'error' && <p className="text-sm text-white/60">No se pudieron cargar los documentos por ahora.</p>}
              {estado === 'listo' && documentos.length === 0 && <p className="text-sm text-white/60">Aún no hay documentos publicados.</p>}
              {estado === 'listo' && documentos.length > 0 && (
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(agrupados).map(([nombre, docs]) => (
                    <div key={nombre}>
                      <p className="text-sm font-bold text-gold-light">{nombre}</p>
                      <ul className="mt-2 space-y-1.5">
                        {docs.map((d) => (
                          <li key={d.id}>
                            <a
                              href={urlDescarga(d.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                            >
                              <Icon name="file" className="h-4 w-4 shrink-0 text-white/45" />
                              <span className="truncate">{d.titulo}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
