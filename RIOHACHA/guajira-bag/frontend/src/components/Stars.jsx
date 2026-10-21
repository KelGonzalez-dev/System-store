// Estrellas de calificación (solo lectura o para elegir)
export default function Stars({ value = 0, size = 14, onPick, label }) {
  const pick = typeof onPick === 'function';
  return (
    <span className={`stars${pick ? ' stars--pick' : ''}`} style={{ '--sz': `${size}px` }} role={pick ? 'radiogroup' : 'img'} aria-label={label || `${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - n + 1));
        const star = (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <defs><linearGradient id={`st${n}${Math.round(fill * 10)}`}><stop offset={fill} stopColor="#d4a24c" /><stop offset={fill} stopColor="#e9dccf" /></linearGradient></defs>
            <path d="M12 2.6l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9z" fill={`url(#st${n}${Math.round(fill * 10)})`} />
          </svg>
        );
        return pick
          ? <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} estrella${n > 1 ? 's' : ''}`} onClick={() => onPick(n)}>{star}</button>
          : <span key={n}>{star}</span>;
      })}
    </span>
  );
}
