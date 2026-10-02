import { useEffect, useState } from 'react';
import { DICT, LANGS, useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';
import { LOCAL } from '../data';

// Aviso de 2 s al cambiar de idioma: el logo se enciende como un neón
export default function LangSwitch() {
  const { switching } = useI18n();
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (switching) { setShown(switching); lockScroll(true); return () => lockScroll(false); }
    return undefined;
  }, [switching]);
  if (!shown) return null;
  const label = LANGS.find((l) => l.code === shown)?.label;
  return (
    <div className={`lang-switch ${switching ? 'on' : ''}`} role="status" aria-live="assertive" onTransitionEnd={(e) => e.target === e.currentTarget && !switching && setShown(null)}>
      <div className="ls-card">
        <img src={LOCAL.logo} alt="" className="ls-logo" />
        <p className="mt-5 text-[13px] uppercase tracking-[0.2em] text-hueso/60">{DICT[shown].loader.switching}</p>
        <p className="mt-1 font-display text-[34px] font-bold uppercase leading-none neon-text">{label}</p>
        <i className="ls-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
