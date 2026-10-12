import { FEED } from '../data';
import { IG, useI18n } from '../i18n';

// Mosaico tipo Instagram con fotos reales de Quile
export default function Insta() {
  const { t } = useI18n();
  return (
    <section className="insta-sec relative overflow-hidden py-[clamp(70px,9vw,110px)]">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">@{IG}</p>
            <h2 className="rv mask-up sec-title mt-3 text-crema"><span>{t.insta.title}</span></h2>
            <p className="rv mt-3 text-[16px] text-crema/70">{t.insta.lead}</p>
          </div>
          <a href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{t.insta.cta}</a>
        </div>
        <div className="feed mt-10">
          {FEED.map((src, i) => (
            <a key={src + i} href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="feed-tile rv" style={{ '--k': i % 6 }} aria-label={`Instagram ${i + 1}`}>
              <img src={src} alt="" loading="lazy" decoding="async" />
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
