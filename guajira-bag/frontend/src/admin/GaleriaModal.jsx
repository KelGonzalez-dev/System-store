import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { createGaleriaItem, updateGaleriaItem } from '../api';
import { toMediaUrl } from '../config';

export default function GaleriaModal({ item, onClose, onSaved }) {
  const esEdicion = !!item;
  const [caption, setCaption] = useState(item?.caption ?? '');
  const [fotos, setFotos] = useState([]);
  const [preview] = useState(item?.url ? toMediaUrl(item.url) : null);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFotos((prev) => [...prev, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    e.target.value = '';
  };
  const quitar = (i) => setFotos((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    if (!esEdicion && fotos.length === 0) {
      setError('Selecciona al menos una foto');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (esEdicion) {
        await updateGaleriaItem(item.id, { caption: caption || null });
      } else {
        for (let i = 0; i < fotos.length; i++) {
          setUploadMsg(fotos.length > 1 ? `Subiendo foto ${i + 1} de ${fotos.length}…` : 'Subiendo…');
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
    <div className="amodal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="amodal" role="dialog" aria-modal="true" aria-label={esEdicion ? 'Editar imagen' : 'Nueva imagen'}>
        <h3>{esEdicion ? 'Editar imagen' : 'Nueva imagen de galería'}</h3>
        <form onSubmit={submit}>
          {esEdicion ? (
            <>
              <label>Foto</label>
              <img src={preview} alt="" className="amodal__preview" style={{ width: 100, height: 100 }} />
            </>
          ) : (
            <>
              <label>Fotos (puedes elegir varias)</label>
              {fotos.length > 0 && (
                <div className="amodal__extra">
                  {fotos.map((f, i) => (
                    <div key={i} className="thumb"><img src={f.preview} alt="" /><button type="button" onClick={() => quitar(i)}><X size={11} /></button></div>
                  ))}
                </div>
              )}
              <button type="button" className="amodal__filebtn" style={{ marginTop: 8 }} onClick={() => fileRef.current.click()}>Elegir fotos</button>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFile} style={{ display: 'none' }} />
            </>
          )}

          <label htmlFor="g-caption">Descripción (opcional)</label>
          <input id="g-caption" className="input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Descripción de la foto" />

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
