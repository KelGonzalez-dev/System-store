import React, { useState, useEffect } from 'react';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from './api';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await login({ username, password });
      localStorage.setItem('gb_token', data.token);
      localStorage.setItem('gb_user', JSON.stringify({ username: data.username, rol: data.rol }));
      onLogin(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%', padding: '13px 16px',
    border: '1px solid var(--border)', borderRadius: '10px 3px 10px 3px',
    fontSize: 14, fontFamily: "'Cormorant Garamond'",
    background: 'rgba(255,251,242,0.9)', color: 'var(--text-primary)',
    outline: 'none', boxSizing: 'border-box', transition: 'border .2s',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(11,17,29,0.78)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--paper)', borderRadius: '28px 8px 28px 8px', width: '100%', maxWidth: 420, padding: '44px 40px 40px', boxShadow: '0 60px 120px rgba(11,17,29,0.4)', position: 'relative', border: '1px solid var(--border)' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(28,20,12,0.06)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={15} color="var(--text-primary)" />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: 44, height: 44, marginBottom: 14, borderRadius: '10px 3px 10px 3px' }} />
              <h2 style={{ fontFamily: "'Fraunces','Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Acceso Admin</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: "'Cormorant Garamond'" }}>Guajira Bags — Panel de administración</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Usuario</label>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Tu nombre de usuario" autoFocus style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" style={{ ...fieldStyle, padding: '13px 44px 13px 16px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC3545', fontFamily: "'Cormorant Garamond'" }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
                style={{ marginTop: 8, padding: '14px', background: loading ? 'rgba(190,91,46,0.5)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#231407', border: 'none', borderRadius: '12px 4px 12px 4px', fontFamily: "'Inter',system-ui,sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .3s' }}
              >
                <LogIn size={16} />
                {loading ? 'Ingresando...' : 'Ingresar'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
