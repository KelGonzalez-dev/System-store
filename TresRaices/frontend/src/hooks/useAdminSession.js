import { useCallback, useEffect, useState } from 'react';
import { cerrarSesionApi, getToken, iniciarSesion, obtenerPerfil, setToken } from '../data/api';

export function useAdminSession() {
  const [token, setTokenState] = useState(() => getToken());
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(!!getToken());

  useEffect(() => {
    let activo = true;
    if (!token) {
      setUsuario(null);
      setVerificando(false);
      return;
    }
    setVerificando(true);
    obtenerPerfil(token)
      .then((u) => activo && setUsuario(u))
      .catch(() => {
        if (!activo) return;
        setToken(null);
        setTokenState(null);
        setUsuario(null);
      })
      .finally(() => activo && setVerificando(false));
    return () => {
      activo = false;
    };
  }, [token]);

  const login = useCallback(async (nombreUsuario, clave) => {
    const datos = await iniciarSesion(nombreUsuario, clave);
    setToken(datos.token);
    setTokenState(datos.token);
    setUsuario(datos.usuario);
    return datos;
  }, []);

  const logout = useCallback(async () => {
    const actual = token;
    setToken(null);
    setTokenState(null);
    setUsuario(null);
    if (actual) {
      try {
        await cerrarSesionApi(actual);
      } catch {}
    }
  }, [token]);

  return { token, usuario, verificando, login, logout, autenticado: !!usuario };
}
