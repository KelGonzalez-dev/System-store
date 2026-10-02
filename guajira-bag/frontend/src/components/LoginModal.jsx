import { useEffect, useState } from 'react';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onValidate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    const msg = await onValidate(username.trim(), password);
    setLoading(false);
    if (msg) setError(msg);
    else { setPassword(''); }
  };

  return (
    <div className="modal-veil" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="login-card" role="dialog" aria-modal="true" aria-label="Acceso administrativo">
        <button type="button" className="login-card__close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        <img src="/images/logo.webp" alt="" className="login-card__mark" />
        <h2>Acceso administrativo</h2>
        <p className="sub">Guajira Bags</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="gb-user">Usuario</label>
            <input id="gb-user" className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" disabled={loading} />
          </div>
          <div className="field">
            <label htmlFor="gb-pass">Clave</label>
            <div className="input-row">
              <input id="gb-pass" className="input" type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" disabled={loading} style={{ paddingRight: 44 }} />
              <button type="button" className="eye" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? 'Ocultar clave' : 'Mostrar clave'}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--gold" disabled={loading}>
            <LogIn size={16} />{loading ? 'Validando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
