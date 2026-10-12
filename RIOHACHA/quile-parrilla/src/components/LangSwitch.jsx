import { useEffect, useState } from 'react';
import { QuileLogo } from './Brand';
import { DICT, LANGS, useI18n } from '../i18n';
import { lockScroll } from '../lib/scroll';

export default function LangSwitch() {
  const { switching } = useI18n();
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (switching) { setShown(switching); lockScroll(true); return () => lockScroll(false); }
    return undefined;
  }, [switching]);
  if (!shown) return null;
  return (
    <div className={`lang-switch ${switching ? 'on' : ''}`} role="status" aria-live="assertive" onTransitionEnd={(e) => e.target === e.currentTarget && !switching && setShown(null)}>
      <div className="ls-card">
        <div className="mx-auto w-40"><QuileLogo plank={false} /></div>
        <p className="mt-4 text-[13px] uppercase tracking-[0.2em] text-crema/60">{DICT[shown].loader.switching}</p>
        <p className="mt-1 font-display text-[30px] uppercase text-crema">{LANGS.find((l) => l.code === shown)?.label}</p>
        <i className="ls-bar" aria-hidden="true" />
      </div>
    </div>
  );
}
