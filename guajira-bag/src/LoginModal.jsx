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

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Bloquear scroll
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 4000,
            background: 'rgba(10,8,5,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFCF7',
              borderRadius: 24,
              width: '100%',
              maxWidth: 420,
              padding: '44px 40px 40px',
              boxShadow: '0 60px 120px rgba(0,0,0,0.28)',
              position: 'relative'
            }}
          >
            {/* Cerrar */}
            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
              width: 34, height: 34, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={15} color="#1A1A1A" />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: 44, height: 44, marginBottom: 14 }} />
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 6
              }}>
                Acceso Admin
              </h2>
              <p style={{ fontSize: 13, color: '#9A8E84', fontFamily: "'Cormorant Garamond'" }}>
                Guajira Bags — Panel de administración
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, letterSpacing: '0.1em', color: '#9A8E84', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Tu nombre de usuario"
                  autoFocus
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1px solid rgba(184,134,46,0.25)', borderRadius: 10,
                    fontSize: 14, fontFamily: "'Cormorant Garamond'",
                    background: 'rgba(255,248,238,0.8)', color: '#1A1A1A',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#B8862E'}
                  onBlur={e => e.target.style.borderColor = 'rgba(184,134,46,0.25)'}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, letterSpacing: '0.1em', color: '#9A8E84', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '13px 44px 13px 16px',
                      border: '1px solid rgba(184,134,46,0.25)', borderRadius: 10,
                      fontSize: 14, fontFamily: "'Cormorant Garamond'",
                      background: 'rgba(255,248,238,0.8)', color: '#1A1A1A',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#B8862E'}
                    onBlur={e => e.target.style.borderColor = 'rgba(184,134,46,0.25)'}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9A8E84',
                    display: 'flex', alignItems: 'center'
                  }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)',
                  borderRadius: 8, padding: '10px 14px',
                  fontSize: 13, color: '#DC3545', fontFamily: "'Cormorant Garamond'"
                }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                style={{
                  marginTop: 8, padding: '14px',
                  background: loading
                    ? 'rgba(184,134,46,0.5)'
                    : 'linear-gradient(135deg, #B8862E 0%, #E6C98A 100%)',
                  color: '#FFF', border: 'none', borderRadius: 10,
                  fontFamily: "'Cormorant Garamond'", fontSize: 16, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.3s'
                }}
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