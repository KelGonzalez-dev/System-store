import { useEffect, useState } from 'react';
import { FLAME } from './Logo';
import { DICT, LANGS, useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';

// Aviso breve al cambiar de idioma (2 s): emblema que se dibuja, texto en el idioma de destino y barra de avance
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
        <svg viewBox="0 0 100 100" className="ls-logo" aria-hidden="true">
          {FLAME.map((d, i) => <path key={d} d={d} pathLength="1" style={{ '--i': i }} />)}
        </svg>
        <p className="mt-5 text-[14px] text-mute">{DICT[shown].loader.switching}</p>
        <p className="mt-1 font-display text-[30px] leading-tight text-ash">{label}</p>
        <i className="ls-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
