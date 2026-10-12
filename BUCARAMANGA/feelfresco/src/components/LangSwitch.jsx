import { useEffect, useState } from 'react';
import { Badge } from './Mascot';
import { DICT, LANGS, useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';

// Aviso de 2 s al cambiar de idioma: la mascota chifla mientras cambia
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
        <div className="mx-auto w-28"><Badge className="w-full" /></div>
        <p className="mt-3 text-[14px] font-semibold text-vino/70">{DICT[shown].loader.switching}</p>
        <p className="font-display text-[34px] leading-none text-rojo">{label}</p>
        <i className="ls-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
