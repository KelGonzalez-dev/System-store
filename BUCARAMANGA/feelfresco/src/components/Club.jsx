import { Badge } from './Mascot';
import Palm from './Palm';
import { LOCAL } from '../data';
import { IG, useI18n } from '../i18n';

// Burger Club: el letrero real con la mascota, notas flotando y la invitación al canal
export default function Club() {
  const { t } = useI18n();
  return (
    <section id="club" className="club-sec relative overflow-hidden">
      <Palm className="club-palm" color="#C81F2A" />
      <div className="wrap relative grid items-center gap-12 py-[clamp(80px,10vw,130px)] lg:grid-cols-2">
        <div className="club-visual">
          <div className="club-photo"><img src={LOCAL.letrero} alt="Burger Club" loading="lazy" /></div>
          <div className="club-badge"><Badge className="w-full" /></div>
          <span className="club-notes" aria-hidden="true"><i>♪</i><i>♫</i><i>♪</i></span>
        </div>
        <div>
          <p className="font-script text-[clamp(44px,5vw,70px)] leading-none text-amarillo">Burger Club</p>
          <h2 className="rv mask-up sec-title mt-3 text-crema"><span>{t.club.title}</span></h2>
          <p className="rv mt-5 max-w-[46ch] text-[17px] leading-relaxed text-crema/85">{t.club.lead}</p>
          <ul className="mt-7 grid gap-3">
            {t.club.points.map((x) => <li key={x} className="club-pt"><i aria-hidden="true">✦</i>{x}</li>)}
          </ul>
          <a href={`https://www.instagram.com/${IG}`} target="_blank" rel="noopener noreferrer" className="btn btn-yellow mt-9">{t.club.cta}</a>
        </div>
      </div>
    </section>
  );
}
