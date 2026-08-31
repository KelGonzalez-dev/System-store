import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, LogOut, Package, Image, Check, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getProductos, createProducto, updateProducto, deleteProducto, addProductoImagen,
  getGaleria, createGaleriaItem, updateGaleriaItem, deleteGaleriaItem
} from './api';
import { toMediaUrl } from './config';

// ── Helpers ──────────────────────────────────────────────────

function imgSrc(url) {
  return toMediaUrl(url);
}

function Toast({ msg, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, background: type === 'error' ? '#DC3545' : '#28a745',
        color: '#fff', borderRadius: 10, padding: '12px 24px',
        fontFamily: "'Cormorant Garamond'", fontSize: 15,
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
      }}
    >
      {msg}
    </motion.div>
  );
}

function ConfirmDialog({ msg, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 6000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        style={{
          background: '#FFFCF7', borderRadius: 18, padding: '32px 36px',
          maxWidth: 380, width: '100%', textAlign: 'center',
          boxShadow: '0 40px 80px rgba(0,0,0,0.20)'
        }}
      >
        <p style={{ fontFamily: "'Playfair Display'", fontSize: 17, color: '#1A1A1A', marginBottom: 24 }}>{msg}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '10px 24px', borderRadius: 8, border: '1px solid #ddd',
            background: '#f5f5f5', cursor: 'pointer', fontFamily: "'Cormorant Garamond'", fontSize: 14
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            background: '#DC3545', color: '#fff', cursor: 'pointer',
            fontFamily: "'Cormorant Garamond'", fontSize: 14, fontWeight: 600
          }}>Eliminar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal Producto ────────────────────────────────────────────

function ProductoModal({ producto, onClose, onSaved }) {
  const [nombre, setNombre] = useState(producto?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
  const [descripcionLarga, setDescripcionLarga] = useState(producto?.descripcionLarga ?? '');
  const [precio, setPrecio] = useState(producto?.precio ?? '');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(producto?.imagenUrl ? imgSrc(producto.imagenUrl) : null);
  // Fotos adicionales (galería del producto) — se pueden seleccionar varias a la vez
  const [extraFotos, setExtraFotos] = useState([]); // [{ file, preview }]
  const [existentes] = useState(
    Array.isArray(producto?.imagenes) ? producto.imagenes : []
  );
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();
  const extraFileRef = useRef();

  const esEdicion = !!producto;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImagen(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleExtraFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const nuevas = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setExtraFotos(prev => [...prev, ...nuevas]);
    e.target.value = ''; // permite volver a elegir el mismo archivo si se quita
  };

  const quitarExtraFoto = (idx) => {
    setExtraFotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim() || !precio) {
      setError('Nombre, descripción y precio son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('nombre', nombre);
      form.append('descripcion', descripcion);
      if (descripcionLarga) form.append('descripcionLarga', descripcionLarga);
      form.append('precio', precio);
      if (imagen) {
        form.append(esEdicion ? 'nuevaImagen' : 'imagen', imagen);
      }

      let productoId = producto?.id;
      if (esEdicion) {
        await updateProducto(producto.id, form);
      } else {
        const creado = await createProducto(form);
        productoId = creado?.id ?? creado?.producto?.id;
      }

      // Subir fotos adicionales una por una (si se seleccionaron)
      if (productoId && extraFotos.length) {
        for (let i = 0; i < extraFotos.length; i++) {
          setUploadMsg(`Subiendo foto ${i + 1} de ${extraFotos.length}...`);
          const fd = new FormData();
          fd.append('imagen', extraFotos[i].file);
          await addProductoImagen(productoId, fd);
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error');
    } finally {
      setLoading(false);
      setUploadMsg('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFCF7', borderRadius: 22, width: '100%', maxWidth: 580,
          maxHeight: '90vh', overflowY: 'auto',
          padding: '36px 36px 32px',
          boxShadow: '0 60px 120px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: '#1A1A1A' }}>
            {esEdicion ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#666" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Imagen */}
          <div>
            <label style={labelStyle}>Imagen principal</label>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: '2px dashed rgba(184,134,46,0.35)', borderRadius: 12,
                height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', overflow: 'hidden', background: 'rgba(255,248,238,0.6)',
                transition: 'border 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#B8862E'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,134,46,0.35)'}
            >
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center', color: '#B8862E' }}>
                    <Upload size={28} />
                    <p style={{ fontSize: 13, marginTop: 8, fontFamily: "'Cormorant Garamond'" }}>Clic para subir imagen</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          {/* Fotos adicionales (galería del producto) */}
          <div>
            <label style={labelStyle}>Fotos adicionales (opcional, puedes elegir varias)</label>

            {existentes.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {existentes.map((url, i) => (
                  <img key={`ex-${i}`} src={imgSrc(url)} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(184,134,46,0.25)' }} />
                ))}
              </div>
            )}

            {extraFotos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                {extraFotos.map((f, i) => (
                  <div key={i} style={{ position: 'relative', width: 56, height: 56 }}>
                    <img src={f.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(184,134,46,0.35)' }} />
                    <button type="button" onClick={() => quitarExtraFoto(i)} style={{
                      position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
                      background: '#DC3545', color: '#fff', border: '2px solid #FFFCF7', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                    }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => extraFileRef.current.click()} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              border: '2px dashed rgba(184,134,46,0.35)', borderRadius: 12, padding: '12px',
              background: 'rgba(255,248,238,0.6)', cursor: 'pointer', color: '#B8862E',
              fontFamily: "'Cormorant Garamond'", fontSize: 13, justifyContent: 'center'
            }}>
              <Upload size={16} /> Agregar fotos (selección múltiple)
            </button>
            <input ref={extraFileRef} type="file" accept="image/*" multiple onChange={handleExtraFiles} style={{ display: 'none' }} />
          </div>

          <div>
            <label style={labelStyle}>Nombre *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Mochila Wayuu Roja" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Descripción corta *</label>
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Breve descripción del producto" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Descripción larga (detalle)</label>
            <textarea value={descripcionLarga} onChange={e => setDescripcionLarga(e.target.value)}
              placeholder="Descripción completa que aparece en el modal del producto..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div>
            <label style={labelStyle}>Precio (COP) *</label>
            <input type="number" value={precio} onChange={e => setPrecio(e.target.value)}
              placeholder="150000" min="0" style={inputStyle} />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Cancelar</button>
            <button type="submit" disabled={loading} style={btnPrimary}>
              <Check size={15} />
              {loading ? (uploadMsg || 'Guardando...') : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Modal Galería ─────────────────────────────────────────────

function GaleriaModal({ item, onClose, onSaved }) {
  const [caption, setCaption] = useState(item?.caption ?? '');
  // Selección múltiple: cada foto elegida se sube como un ítem de galería aparte
  const [fotos, setFotos] = useState([]); // [{ file, preview }]
  const [preview, setPreview] = useState(item?.url ? imgSrc(item.url) : null);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();
  const esEdicion = !!item;

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (esEdicion) {
      // En edición solo se reemplaza caption, no aplica multi-selección
      return;
    }
    const nuevas = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setFotos(prev => [...prev, ...nuevas]);
    e.target.value = '';
  };

  const quitarFoto = (idx) => setFotos(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esEdicion && fotos.length === 0) { setError('Selecciona al menos una foto'); return; }
    setLoading(true);
    setError('');
    try {
      if (esEdicion) {
        await updateGaleriaItem(item.id, { caption: caption || null });
      } else {
        for (let i = 0; i < fotos.length; i++) {
          setUploadMsg(fotos.length > 1 ? `Subiendo foto ${i + 1} de ${fotos.length}...` : 'Subiendo...');
          const form = new FormData();
          form.append('foto', fotos[i].file);
          if (caption) form.append('caption', caption);
          await createGaleriaItem(form);
        }
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error');
    } finally {
      setLoading(false);
      setUploadMsg('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFCF7', borderRadius: 22, width: '100%', maxWidth: 460,
          padding: '36px 36px 32px',
          boxShadow: '0 60px 120px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: 22, color: '#1A1A1A' }}>
            {esEdicion ? 'Editar imagen' : 'Nueva imagen'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#666" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!esEdicion && (
            <div>
              <label style={labelStyle}>Fotos * (puedes seleccionar varias a la vez)</label>

              {fotos.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {fotos.map((f, i) => (
                    <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                      <img src={f.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(184,134,46,0.3)' }} />
                      <button type="button" onClick={() => quitarFoto(i)} style={{
                        position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
                        background: '#DC3545', color: '#fff', border: '2px solid #FFFCF7', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                      }}>
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => fileRef.current.click()}
                    style={{
                      width: 72, height: 72, borderRadius: 10, border: '2px dashed rgba(184,134,46,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#B8862E'
                    }}
                  >
                    <Plus size={20} />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: '2px dashed rgba(184,134,46,0.35)', borderRadius: 12,
                    height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', background: 'rgba(255,248,238,0.6)'
                  }}
                >
                  <div style={{ textAlign: 'center', color: '#B8862E' }}>
                    <Upload size={28} />
                    <p style={{ fontSize: 13, marginTop: 8, fontFamily: "'Cormorant Garamond'" }}>Clic para subir una o varias fotos</p>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFile} style={{ display: 'none' }} />
            </div>
          )}

          {esEdicion && preview && (
            <img src={preview} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
          )}

          <div>
            <label style={labelStyle}>Caption {fotos.length > 1 ? '(se aplica a todas las fotos, opcional)' : '(opcional)'}</label>
            <input value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="Descripción de la foto..." style={inputStyle} />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Cancelar</button>
            <button type="submit" disabled={loading} style={btnPrimary}>
              <Check size={15} />
              {loading ? (uploadMsg || 'Guardando...') : esEdicion ? 'Guardar' : (fotos.length > 1 ? `Subir ${fotos.length} fotos` : 'Subir foto')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── AdminPanel principal ──────────────────────────────────────

export default function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = useState('productos');

  // Productos
  const [productos, setProductos] = useState([]);
  const [prodPage, setProdPage] = useState(1);
  const [prodTotal, setProdTotal] = useState(0);
  const [prodPages, setProdPages] = useState(1);
  const [loadingProd, setLoadingProd] = useState(false);

  // Galería
  const [galeria, setGaleria] = useState([]);
  const [loadingGal, setLoadingGal] = useState(false);

  // Modales
  const [modalProducto, setModalProducto] = useState(null);  // null | 'new' | {producto}
  const [modalGaleria, setModalGaleria] = useState(null);    // null | 'new' | {item}
  const [confirm, setConfirm] = useState(null);              // null | { msg, onConfirm }

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Cargar datos ──────────────────────────────────────────
  const cargarProductos = async (page = prodPage) => {
    setLoadingProd(true);
    try {
      const data = await getProductos(page, 10, false);
      setProductos(data.items);
      setProdTotal(data.total);
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
      const data = await getGaleria(false);
      setGaleria(data);
    } catch {
      showToast('Error cargando galería', 'error');
    } finally {
      setLoadingGal(false);
    }
  };

  useEffect(() => { cargarProductos(1); }, []);
  useEffect(() => { if (tab === 'galeria') cargarGaleria(); }, [tab]);

  // ── Eliminar producto ─────────────────────────────────────
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
      }
    });
  };

  // ── Eliminar galería ──────────────────────────────────────
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
      }
    });
  };

  // ── Toggle activo galería ─────────────────────────────────
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
    <div style={{ minHeight: '100vh', background: '#F6F0E7' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: '#1A1A1A', color: '#F7E3B7',
        padding: '0 clamp(16px,4vw,60px)', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: 28, height: 28 }} />
          <span style={{ fontFamily: "'Playfair Display'", fontSize: 17 }}>Guajira Bags</span>
          <span style={{ color: 'rgba(247,227,183,0.4)', fontSize: 14, margin: '0 4px' }}>·</span>
          <span style={{ fontSize: 13, color: 'rgba(247,227,183,0.7)', fontFamily: "'Cormorant Garamond'" }}>
            Panel Admin
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(247,227,183,0.7)', fontFamily: "'Cormorant Garamond'" }}>
            {user?.username}
          </span>
          <button onClick={onLogout} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, color: '#F7E3B7', padding: '7px 14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: "'Cormorant Garamond'", fontSize: 13
          }}>
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(16px,4vw,60px)' }}>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 36, background: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[
            { key: 'productos', label: 'Productos', icon: <Package size={16} /> },
            { key: 'galeria',   label: 'Galería',   icon: <Image size={16} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: "'Cormorant Garamond'", fontSize: 15, fontWeight: 600,
              background: tab === t.key ? '#FFFCF7' : 'transparent',
              color: tab === t.key ? '#B8862E' : '#9A8E84',
              boxShadow: tab === t.key ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s'
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB PRODUCTOS ══════════════════════════════════ */}
        {tab === 'productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 28, color: '#1A1A1A', marginBottom: 4 }}>Productos</h1>
                <p style={{ fontSize: 13, color: '#9A8E84', fontFamily: "'Cormorant Garamond'" }}>{prodTotal} productos en total</p>
              </div>
              <button onClick={() => setModalProducto('new')} style={btnPrimary}>
                <Plus size={15} /> Nuevo producto
              </button>
            </div>

            {loadingProd ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9A8E84', fontFamily: "'Cormorant Garamond'" }}>Cargando...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {productos.map(p => (
                  <motion.div key={p.id} layout
                    style={{
                      background: '#FFFCF7', borderRadius: 14,
                      border: '1px solid rgba(184,134,46,0.14)',
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '14px 18px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Imagen */}
                    <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#F4EDE1' }}>
                      {p.imagenUrl
                        ? <img src={imgSrc(p.imagenUrl)} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="#C8B89A" />
                          </div>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display'", fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>
                        {p.nombre}
                      </div>
                      <div style={{ fontSize: 12, color: '#9A8E84', fontFamily: "'Cormorant Garamond'", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.descripcion}
                      </div>
                    </div>

                    {/* Precio */}
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: '#B8862E', whiteSpace: 'nowrap', marginRight: 8 }}>
                      ${Number(p.precio).toLocaleString('es-CO')}
                    </div>

                    {/* Estado */}
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: p.activo ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
                      color: p.activo ? '#28a745' : '#DC3545',
                      fontFamily: "'Cormorant Garamond'", whiteSpace: 'nowrap'
                    }}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => setModalProducto(p)} style={iconBtn('#B8862E')}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDeleteProducto(p.id, p.nombre)} style={iconBtn('#DC3545')}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {prodPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 32 }}>
                <button onClick={() => { const p = prodPage - 1; setProdPage(p); cargarProductos(p); }}
                  disabled={prodPage === 1} style={pageBtn(false)}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 14, color: '#5B524B' }}>
                  Página {prodPage} de {prodPages}
                </span>
                <button onClick={() => { const p = prodPage + 1; setProdPage(p); cargarProductos(p); }}
                  disabled={prodPage === prodPages} style={pageBtn(false)}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB GALERÍA ════════════════════════════════════ */}
        {tab === 'galeria' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display'", fontSize: 28, color: '#1A1A1A', marginBottom: 4 }}>Galería</h1>
                <p style={{ fontSize: 13, color: '#9A8E84', fontFamily: "'Cormorant Garamond'" }}>{galeria.length} imágenes</p>
              </div>
              <button onClick={() => setModalGaleria('new')} style={btnPrimary}>
                <Plus size={15} /> Subir foto
              </button>
            </div>

            {loadingGal ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9A8E84', fontFamily: "'Cormorant Garamond'" }}>Cargando...</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16
              }}>
                {galeria.map(item => (
                  <motion.div key={item.id} layout style={{
                    background: '#FFFCF7', borderRadius: 14,
                    border: '1px solid rgba(184,134,46,0.14)',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    opacity: item.activo ? 1 : 0.5
                  }}>
                    <div style={{ position: 'relative', paddingBottom: '80%', background: '#F4EDE1' }}>
                      <img
                        src={imgSrc(item.url)}
                        alt={item.caption ?? ''}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {!item.activo && (
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ color: '#fff', fontSize: 12, fontFamily: "'Cormorant Garamond'" }}>Oculta</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <p style={{ fontSize: 12, color: '#6B6259', fontFamily: "'Cormorant Garamond'", marginBottom: 10, minHeight: 18 }}>
                        {item.caption || <span style={{ color: '#C8B89A', fontStyle: 'italic' }}>Sin caption</span>}
                      </p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => toggleActivoGaleria(item)} style={{ ...iconBtn(item.activo ? '#9A8E84' : '#28a745'), flex: 1, borderRadius: 7, padding: '6px 0', fontSize: 11, fontFamily: "'Cormorant Garamond'" }}>
                          {item.activo ? 'Ocultar' : 'Mostrar'}
                        </button>
                        <button onClick={() => setModalGaleria(item)} style={iconBtn('#B8862E')}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteGaleria(item.id)} style={iconBtn('#DC3545')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modales ── */}
      <AnimatePresence>
        {modalProducto && (
          <ProductoModal
            producto={modalProducto === 'new' ? null : modalProducto}
            onClose={() => setModalProducto(null)}
            onSaved={() => { showToast('Producto guardado ✓'); cargarProductos(prodPage); }}
          />
        )}
        {modalGaleria && (
          <GaleriaModal
            item={modalGaleria === 'new' ? null : modalGaleria}
            onClose={() => setModalGaleria(null)}
            onSaved={() => { showToast('Imagen guardada ✓'); cargarGaleria(); }}
          />
        )}
        {confirm && (
          <ConfirmDialog
            msg={confirm.msg}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}

// ── Estilos reutilizables ─────────────────────────────────────

const labelStyle = {
  fontSize: 11, letterSpacing: '0.1em', color: '#9A8E84',
  textTransform: 'uppercase', display: 'block', marginBottom: 6
};

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1px solid rgba(184,134,46,0.22)', borderRadius: 10,
  fontSize: 14, fontFamily: "'Cormorant Garamond'",
  background: 'rgba(255,248,238,0.8)', color: '#1A1A1A',
  outline: 'none', boxSizing: 'border-box'
};

const errorStyle = {
  background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)',
  borderRadius: 8, padding: '10px 14px',
  fontSize: 13, color: '#DC3545', fontFamily: "'Cormorant Garamond'"
};

const btnPrimary = {
  padding: '11px 20px',
  background: 'linear-gradient(135deg, #B8862E 0%, #E6C98A 100%)',
  color: '#FFF', border: 'none', borderRadius: 10,
  fontFamily: "'Cormorant Garamond'", fontSize: 14, fontWeight: 600,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
  transition: 'filter 0.2s'
};

const btnSecondary = {
  flex: 1, padding: '11px',
  background: '#f5f5f5', color: '#5B524B',
  border: '1px solid #ddd', borderRadius: 10,
  fontFamily: "'Cormorant Garamond'", fontSize: 14, cursor: 'pointer'
};

const iconBtn = (color) => ({
  background: `${color}15`, border: `1px solid ${color}30`,
  borderRadius: 8, color, width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
});

const pageBtn = () => ({
  background: '#FFFCF7', border: '1px solid rgba(184,134,46,0.22)',
  borderRadius: 8, width: 34, height: 34,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#5B524B'
});