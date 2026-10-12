import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { addProductoImagen, createProducto, updateProducto } from '../api';
import { toMediaUrl } from '../config';

export default function ProductoModal({ producto, onClose, onSaved }) {
  const esEdicion = !!producto;
  const [nombre, setNombre] = useState(producto?.nombre ?? '');
  const [codigo, setCodigo] = useState(producto?.codigo ?? '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
  const [descripcionLarga, setDescripcionLarga] = useState(producto?.descripcionLarga ?? '');
  const [precio, setPrecio] = useState(producto?.precio ?? '');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(producto?.imagenUrl ? toMediaUrl(producto.imagenUrl) : null);
  const [extraFotos, setExtraFotos] = useState([]);
  const [existentes] = useState(Array.isArray(producto?.imagenes) ? producto.imagenes : []);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();
  const extraFileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImagen(f);
    setPreview(URL.createObjectURL(f));
  };
  const handleExtraFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setExtraFotos((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    e.target.value = '';
  };
  const quitarExtra = (i) => setExtraFotos((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !descripcion.trim() || !precio) {
      setError('Nombre, descripción y precio son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      if (codigo) form.append('codigo', codigo);
      form.append('nombre', nombre);
      form.append('descripcion', descripcion);
      if (descripcionLarga) form.append('descripcionLarga', descripcionLarga);
      form.append('precio', precio);
      if (imagen) form.append(esEdicion ? 'nuevaImagen' : 'imagen', imagen);

      let productoId = producto?.id;
      if (esEdicion) await updateProducto(producto.id, form);
      else {
        const creado = await createProducto(form);
        productoId = creado?.id ?? creado?.producto?.id;
      }

      if (productoId && extraFotos.length) {
        for (let i = 0; i < extraFotos.length; i++) {
          setUploadMsg(`Subiendo foto ${i + 1} de ${extraFotos.length}…`);
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
    <div className="amodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="amodal" role="dialog" aria-modal="true" aria-label={esEdicion ? 'Editar producto' : 'Nuevo producto'}>
        <h3>{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h3>
        <form onSubmit={submit}>
          <label>Imagen principal</label>
          <div className="amodal__filebox">
            {preview ? <img src={preview} alt="" className="amodal__preview" /> : <div className="amodal__preview" />}
            <button type="button" className="amodal__filebtn" onClick={() => fileRef.current.click()}>Elegir imagen</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </div>

          <label>Fotos adicionales (opcional, puedes elegir varias)</label>
          {existentes.length > 0 && (
            <div className="amodal__extra">
              {existentes.map((url, i) => <div key={i} className="thumb"><img src={toMediaUrl(url)} alt="" /></div>)}
            </div>
          )}
          {extraFotos.length > 0 && (
            <div className="amodal__extra">
              {extraFotos.map((f, i) => (
                <div key={i} className="thumb"><img src={f.preview} alt="" /><button type="button" onClick={() => quitarExtra(i)}><X size={11} /></button></div>
              ))}
            </div>
          )}
          <button type="button" className="amodal__filebtn" style={{ marginTop: 8 }} onClick={() => extraFileRef.current.click()}>
            <Upload size={14} style={{ marginRight: 6, display: 'inline' }} />Agregar fotos
          </button>
          <input ref={extraFileRef} type="file" accept="image/*" multiple onChange={handleExtraFiles} style={{ display: 'none' }} />

          <label htmlFor="p-nombre">Nombre *</label>
          <input id="p-nombre" className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Mochila Wayuu Roja" />

          <label htmlFor="p-codigo">Código / NIT (opcional)</label>
          <input id="p-codigo" className="input" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ejem: GUAJ-0001" />

          <label htmlFor="p-desc">Descripción corta *</label>
          <input id="p-desc" className="input" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Breve descripción del producto" />

          <label htmlFor="p-desclarga">Descripción larga (detalle)</label>
          <textarea id="p-desclarga" className="input" value={descripcionLarga} onChange={(e) => setDescripcionLarga(e.target.value)} placeholder="Descripción completa que aparece en el modal del producto…" />

          <label htmlFor="p-precio">Precio (COP) *</label>
          <input id="p-precio" type="number" min="0" className="input" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="150000" />

          {error && <p className="amodal__err" role="alert">{error}</p>}
          {uploadMsg && <p className="amodal__upmsg">{uploadMsg}</p>}

          <div className="amodal__foot">
            <button type="button" className="btn btn--line" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn--gold" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
