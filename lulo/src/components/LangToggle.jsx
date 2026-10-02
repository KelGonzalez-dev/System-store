import { useLang } from '../i18n/LangContext';

export default function LangToggle({ className = '' }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.nav.langLabel} className={`relative inline-flex items-center rounded-full border border-neon/25 p-0.5 font-display text-[12px] font-medium tracking-[.2em] ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-ember transition-transform duration-500"
        style={{ transform: lang === 'es' ? 'translateX(0)' : 'translateX(100%)', transitionTimingFunction: 'cubic-bezier(.2,.7,.2,1)' }}
      />
      {['es', 'en'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`relative z-10 w-11 py-1.5 text-center uppercase transition-colors duration-300 ${lang === l ? 'text-neon' : 'text-neon/55 hover:text-neon'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
