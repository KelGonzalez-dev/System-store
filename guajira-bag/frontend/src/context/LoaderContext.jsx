import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

const Ctx = createContext(null);
export const useLoader = () => useContext(Ctx);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const LOADS = {
  boot: { label: 'Guajira Bags', sub: 'Bienvenida a tu tienda', ms: 5000 },
  admin: { label: 'Panel administrativo', sub: 'Abriendo el taller', ms: 5000, lines: ['Preparando tu taller', 'Ordenando los hilos', 'Todo listo para ti'] },
  login: { label: 'Validando credenciales', sub: 'Verificando tu acceso', ms: 3000, lines: ['Validando credenciales…', 'Verificando tu acceso', 'Un momento, por favor'] },
  logout: { label: 'Cerrando sesión', sub: 'Hasta pronto', ms: 5000, lines: ['Guardando tus cambios', 'Cerrando tu sesión de forma segura', 'Vuelve pronto'] },
};

/**
 * run(config, task?, onReady?)
 * - muestra el loader al menos config.ms milisegundos
 * - ejecuta task() en paralelo (p. ej. la llamada de login)
 * - onReady(result, error) se ejecuta con la pantalla aún tapando (navegar, cambiar estado)
 */
export function LoaderProvider({ children }) {
  const [screen, setScreen] = useState({ ...LOADS.boot, id: 1, leaving: false });
  const idRef = useRef(0);
  const busy = useRef(false);
  const booted = useRef(false);

  const run = useCallback(async (cfg, task, onReady) => {
    if (busy.current) return;
    busy.current = true;
    const id = ++idRef.current;
    const t0 = performance.now();
    setScreen({ ...cfg, id, leaving: false });
    let result;
    let error;
    if (task) {
      try { result = await task(); } catch (e) { error = e; }
    }
    const left = cfg.ms - (performance.now() - t0);
    if (left > 0) await sleep(left);
    onReady?.(result, error);
    setScreen((s) => (s && s.id === id ? { ...s, leaving: true } : s));
    await sleep(1300);
    setScreen((s) => (s && s.id === id ? null : s));
    busy.current = false;
  }, []);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    run(LOADS.boot, null, () => document.documentElement.classList.add('ready'));
  }, [run]);

  return (
    <Ctx.Provider value={run}>
      {children}
      {screen && <LoadingScreen key={screen.id} {...screen} />}
    </Ctx.Provider>
  );
}
