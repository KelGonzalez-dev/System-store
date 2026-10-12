import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

const KEY = 'lulo-lang';
const LangContext = createContext(null);

const detectar = () => {
  try {
    const guardado = localStorage.getItem(KEY);
    if (guardado === 'es' || guardado === 'en') return guardado;
  } catch {}
  const idioma = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'es';
  return idioma.toLowerCase().startsWith('en') ? 'en' : 'es';
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectar);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: translations[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
