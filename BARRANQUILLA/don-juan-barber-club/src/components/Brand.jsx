import { BOX, SCRIPT } from '../lib/logoPath';

// Logo neón "Don Juan" (trazo original vectorizado) + "BARBER CLUB"
export function NeonLogo({ className = '', club = true, draw = false, title = 'Don Juan Barber Club' }) {
  const [x, y, w, h] = BOX;
  return (
    <span className={`neon-logo ${draw ? 'is-draw' : ''} ${className}`} role="img" aria-label={title}>
      <svg viewBox={`${x} ${y} ${w} ${h}`} className="nl-svg">
        {draw && <path d={SCRIPT} className="nl-tube" pathLength="1" />}
        <path d={SCRIPT} className="nl-fill" fillRule="evenodd" />
      </svg>
      {club && <b className="nl-club">{'BARBER CLUB'.split('').map((c, i) => <i key={i} style={{ '--i': i }}>{c === ' ' ? '\u00a0' : c}</i>)}</b>}
    </span>
  );
}

export const Fleur = ({ className = '' }) => <span className={`fleur ${className}`} aria-hidden="true">⚜</span>;
