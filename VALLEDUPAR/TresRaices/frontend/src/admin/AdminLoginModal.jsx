import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icons';

export default function AdminLoginModal({ onClose, onSubmit }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const primerCampo = useRef(null);

  useEffect(() => {
    primerCampo.current?.focus();
    const onKey = (e) => e.key === 'Escape' && !enviando && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose, enviando]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !clave) {
      setError('Ingresa tu usuario y tu clave.');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      await onSubmit(usuario.trim(), clave);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
      setEnviando(false);
    }
  };

  return (
    <div className="admin-overlay fixed inset-0 z-[200] flex items-center justify-center bg-forest/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Acceso administrativo">
      <button type="button" aria-label="Cerrar" onClick={() => !enviando && onClose()} className="absolute inset-0 cursor-default" />
      <div className="admin-card relative w-full max-w-sm rounded-3xl bg-cream p-7 text-ink shadow-2xl shadow-black/40 sm:p-8">
        <button
          type="button"
          onClick={() => !enviando && onClose()}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest p-2.5 shadow-lg shadow-forest/25">
          <img src="/logo.webp" alt="Tres Raíces" className="h-full w-full object-contain" draggable="false" />
        </div>
        <p className="mt-4 text-center font-display text-xl font-bold text-forest">Acceso administrativo</p>
        <p className="mt-1 text-center text-sm text-ink/60">Cooperativa Tres Raíces</p>

        <form onSubmit={enviar} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Usuario</span>
            <input
              ref={primerCampo}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              disabled={enviando}
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[16px] focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Clave</span>
            <div className="relative">
              <input
                type={verClave ? 'text' : 'password'}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoComplete="current-password"
                disabled={enviando}
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 pr-11 text-[16px] focus:border-leaf focus:outline-none focus:ring-2 focus:ring-lime/50 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setVerClave((v) => !v)}
                className="absolute inset-y-0 right-2 grid w-8 place-items-center text-ink/40 hover:text-ink"
                aria-label={verClave ? 'Ocultar clave' : 'Mostrar clave'}
              >
                <Icon name={verClave ? 'eyeOff' : 'eye'} className="h-5 w-5" />
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="rounded-xl bg-berry/10 px-3.5 py-2.5 text-sm font-medium text-berry-dark">
              {error}
            </p>
          )}

          <button type="submit" disabled={enviando} className="btn relative w-full overflow-hidden bg-leaf py-3 text-white shadow-lg shadow-leaf/30 hover:bg-forest disabled:opacity-70">
            {enviando && <span className="admin-sweep absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md" aria-hidden="true" />}
            {enviando ? 'Verificando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
