import { useCallback, useState } from 'react';
import { useAdminSession } from '../hooks/useAdminSession';
import AdminLoginModal from './AdminLoginModal';
import AdminPanel from './AdminPanel';
import AdminTransition from './AdminTransition';

const MIN_TRANSICION = 900;

export default function AdminGate() {
  const { token, usuario, verificando, login, logout, autenticado } = useAdminSession();
  const [fase, setFase] = useState('cerrado');

  const abrirLogin = useCallback(() => setFase('login'), []);
  const cerrarTodo = useCallback(() => setFase('cerrado'), []);

  const manejarLogin = async (nombreUsuario, clave) => {
    const inicio = Date.now();
    setFase('verificando');
    try {
      await login(nombreUsuario, clave);
      const faltan = MIN_TRANSICION - (Date.now() - inicio);
      setTimeout(() => setFase('preparando'), Math.max(0, faltan));
      setTimeout(() => setFase('panel'), Math.max(0, faltan) + 700);
    } catch (err) {
      setFase('login');
      throw err;
    }
  };

  const manejarLogout = async () => {
    await logout();
    setFase('cerrado');
  };

  if (fase === 'cerrado') {
    return (
      <button
        type="button"
        onClick={abrirLogin}
        aria-label="Acceso administrativo"
        className="mx-auto mt-2 block h-2.5 w-2.5 rounded-full bg-white/10 outline-none transition-colors duration-500 hover:bg-white/45 focus-visible:bg-white/60"
      />
    );
  }

  if (fase === 'login') {
    return <AdminLoginModal onClose={cerrarTodo} onSubmit={manejarLogin} />;
  }

  if (fase === 'verificando') {
    return <AdminTransition label="Verificando credenciales…" />;
  }

  if (fase === 'preparando') {
    return <AdminTransition label={`Bienvenido${usuario?.nombre ? `, ${usuario.nombre}` : ''}. Preparando el panel…`} />;
  }

  if (fase === 'panel' && autenticado && !verificando) {
    return <AdminPanel token={token} usuario={usuario} onCerrarSesion={manejarLogout} onSalir={cerrarTodo} />;
  }

  return <AdminTransition label="Cargando…" />;
}
