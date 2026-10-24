import { useEffect, useState } from 'react';
import { Image, LogOut, MessageSquareQuote, Package, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import {
  deleteGaleriaItem, deleteProducto, getCategorias, getGaleria, getProductos, updateGaleriaItem,
} from '../api';
import { thumb, toMediaUrl } from '../config';
import ProductoModal from './ProductoModal';
import GaleriaModal from './GaleriaModal';
import ResenasAdmin from './ResenasAdmin';
import CategoriasAdmin from './CategoriasAdmin';

function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`toast${toast.type === 'error' ? ' error' : ''}`} role="status">{toast.msg}</div>;
}

function Confirm({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="amodal-veil" role="presentation">
      <div className="confirm-card">
        <p>{data.msg}</p>
        <div className="row">
          <button type="button" className="btn btn--line" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn btn--gold" onClick={data.onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('productos');

  const [productos, setProductos] = useState([]);
  const [prodPage, setProdPage] = useState(1);
  const [prodPages, setProdPages] = useState(1);
  const [loadingProd, setLoadingProd] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [filtroCat, setFiltroCat] = useState('');
  const cargarCategorias = () => getCategorias().then((d) => setCategorias(d?.categorias || [])).catch(() => {});
  useEffect(() => { cargarCategorias(); }, []);

  const [galeria, setGaleria] = useState([]);
  const [loadingGal, setLoadingGal] = useState(false);

  const [modalProducto, setModalProducto] = useState(null);
  const [modalGaleria, setModalGaleria] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  const cargarProductos = async (page = prodPage) => {
    setLoadingProd(true);
    try {
      const data = await getProductos(page, 12, false, filtroCat ? { categoria: filtroCat } : {});
      setProductos(data.items);
      setProdPages(data.totalPaginas);
    } catch {
      showToast('Error cargando productos', 'error');
    } finally {
      setLoadingProd(false);
    }
  };

  const cargarGaleria = async () => {
    setLoadingGal(true);
    try {
      setGaleria(await getGaleria(false));
    } catch {
      showToast('Error cargando galería', 'error');
    } finally {
      setLoadingGal(false);
    }
  };

  useEffect(() => { cargarProductos(1); }, [filtroCat]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (tab === 'galeria' && galeria.length === 0) cargarGaleria(); }, [tab]);

  const handleDeleteProducto = (id, nombre) => {
    setConfirm({
      msg: `¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await deleteProducto(id);
          showToast('Producto eliminado');
          cargarProductos(prodPage);
        } catch {
          showToast('Error al eliminar', 'error');
        }
      },
    });
  };

  const handleDeleteGaleria = (id) => {
    setConfirm({
      msg: '¿Eliminar esta imagen de la galería?',
      onConfirm: async () => {
        setConfirm(null);
        try {
          await deleteGaleriaItem(id);
          showToast('Imagen eliminada');
          cargarGaleria();
        } catch {
          showToast('Error al eliminar', 'error');
        }
      },
    });
  };

  const toggleActivoGaleria = async (item) => {
    try {
      await updateGaleriaItem(item.id, { activo: !item.activo });
      showToast(item.activo ? 'Imagen ocultada' : 'Imagen visible');
      cargarGaleria();
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <div className="admin-top__brand">
          <img src="/images/emblema-96.webp" alt="" />
          <span>Panel<small>{user?.username}</small></span>
        </div>
        <button type="button" className="admin-logout" onClick={onLogout}><LogOut size={15} />Salir</button>
      </div>

      <div className="admin-body">
        <div className="admin-tabs">
          <button type="button" className={tab === 'productos' ? 'active' : ''} onClick={() => setTab('productos')}><Package size={15} />Productos</button>
          <button type="button" className={tab === 'galeria' ? 'active' : ''} onClick={() => setTab('galeria')}><Image size={15} />Galería</button>
          <button type="button" className={tab === 'categorias' ? 'active' : ''} onClick={() => setTab('categorias')}><Tags size={15} />Categorías</button>
          <button type="button" className={tab === 'resenas' ? 'active' : ''} onClick={() => setTab('resenas')}><MessageSquareQuote size={15} />Reseñas</button>
        </div>

        {tab === 'productos' && (
          <>
            <div className="admin-panel-head">
              <h2>Productos</h2>
              <button type="button" className="btn btn--gold btn--sm" onClick={() => setModalProducto('new')}><Plus size={15} />Nuevo producto</button>
            </div>
            <div className="ares__chips acat__filtro">
              {[['', 'Todas'], ...categorias.map((c) => [String(c.id), `${c.nombre} (${c.total})`]), ['sin', 'Sin categoría']].map(([k, l]) => (
                <button key={k || 'todas'} type="button" className={filtroCat === k ? 'on' : ''} onClick={() => { setFiltroCat(k); setProdPage(1); }}>{l}</button>
              ))}
            </div>
            {loadingProd ? (
              <div className="admin-grid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="acard"><div className="acard__img"><span className="skel" /></div></div>)}</div>
            ) : productos.length === 0 ? (
              <p className="admin-empty">Aún no hay productos.</p>
            ) : (
              <div className="admin-grid">
                {productos.map((p) => (
                  <div key={p.id} className="acard">
                    <div className="acard__img">
                      {p.imagenUrl ? <img src={thumb(p.imagenUrl, 320)} alt={p.nombre} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = toMediaUrl(p.imagenUrl); }} /> : <span className="acard__nophoto">Sin foto</span>}
                      {p.fotosFaltantes > 0 && <span className="acard__warn" title="La foto está registrada pero el archivo no está en el servidor">{p.fotosFaltantes === 1 ? 'Falta 1 foto' : `Faltan ${p.fotosFaltantes} fotos`} · vuelve a subirla</span>}
                      <span className="acard__status" style={{ background: p.activo ? 'rgba(40,167,69,0.14)' : 'rgba(220,53,69,0.14)', color: p.activo ? '#28a745' : '#dc3545' }}>{p.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                    <div className="acard__body">
                      <h4>{p.nombre}</h4>
                      <span className={`acard__cat${p.categoria ? '' : ' none'}`}>{p.categoria ? `${p.categoria.nombre}${p.talla ? ` · ${p.talla}` : ''}` : 'Sin categoría'}</span>
                      <p>{p.descripcion}</p>
                      <p className="acard__price">${Number(p.precio).toLocaleString('es-CO')}</p>
                      <div className="acard__actions">
                        <button type="button" className="edit" onClick={() => setModalProducto(p)}><Pencil size={13} />Editar</button>
                        <button type="button" className="danger" onClick={() => handleDeleteProducto(p.id, p.nombre)}><Trash2 size={13} />Borrar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {prodPages > 1 && (
              <div className="admin-pager">
                <button type="button" disabled={prodPage === 1} onClick={() => { const p = prodPage - 1; setProdPage(p); cargarProductos(p); }}>‹</button>
                <span>Página {prodPage} de {prodPages}</span>
                <button type="button" disabled={prodPage === prodPages} onClick={() => { const p = prodPage + 1; setProdPage(p); cargarProductos(p); }}>›</button>
              </div>
            )}
          </>
        )}

        {tab === 'categorias' && (
          <CategoriasAdmin
            toast={showToast}
            confirm={(msg, fn) => setConfirm({ msg, onConfirm: () => { setConfirm(null); fn(); } })}
            onChange={() => { cargarCategorias(); cargarProductos(1); setProdPage(1); }}
          />
        )}

        {tab === 'resenas' && (
          <ResenasAdmin
            toast={showToast}
            confirm={(msg, fn) => setConfirm({ msg, onConfirm: () => { setConfirm(null); fn(); } })}
          />
        )}

        {tab === 'galeria' && (
          <>
            <div className="admin-panel-head">
              <h2>Galería</h2>
              <button type="button" className="btn btn--gold btn--sm" onClick={() => setModalGaleria('new')}><Plus size={15} />Nueva imagen</button>
            </div>
            {loadingGal ? (
              <div className="admin-grid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="acard"><div className="acard__img"><span className="skel" /></div></div>)}</div>
            ) : galeria.length === 0 ? (
              <p className="admin-empty">Aún no hay imágenes.</p>
            ) : (
              <div className="admin-grid">
                {galeria.map((item) => (
                  <div key={item.id} className={`acard${item.activo ? '' : ' acard--dim'}`}>
                    <div className="acard__img">{item.faltante ? <span className="acard__nophoto">Archivo no encontrado</span> : <img src={thumb(item.url, 320)} alt={item.caption ?? ''} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = toMediaUrl(item.url); }} />}{item.faltante && <span className="acard__warn">Falta la foto · bórrala y súbela de nuevo</span>}</div>
                    <div className="acard__body">
                      <p className="acard__caption">{item.caption || 'Sin descripción'}</p>
                      <div className="acard__actions">
                        <button type="button" onClick={() => toggleActivoGaleria(item)}>{item.activo ? 'Ocultar' : 'Mostrar'}</button>
                        <button type="button" className="edit" onClick={() => setModalGaleria(item)}><Pencil size={13} /></button>
                        <button type="button" className="danger" onClick={() => handleDeleteGaleria(item.id)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalProducto && (
        <ProductoModal producto={modalProducto === 'new' ? null : modalProducto} categorias={categorias} onClose={() => setModalProducto(null)} onSaved={() => { cargarProductos(prodPage); cargarCategorias(); }} />
      )}
      {modalGaleria && (
        <GaleriaModal item={modalGaleria === 'new' ? null : modalGaleria} onClose={() => setModalGaleria(null)} onSaved={cargarGaleria} />
      )}
      <Confirm data={confirm} onClose={() => setConfirm(null)} />
      <Toast toast={toast} />
    </div>
  );
}
