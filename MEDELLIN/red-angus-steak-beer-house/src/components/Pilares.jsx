const P = [
  ['Cortes Angus', 'Seleccionados y madurados para darte el mejor sabor.', <path key="a" d="M8 26c0-10 9-16 20-16s18 4 18 12-8 14-20 14S8 34 8 26z M34 14c4 2 7 6 7 11" />],
  ['Parrilla al carbón', 'Fuego lento, sal marina y el punto exacto.', <path key="b" d="M8 30h40M12 30l4 12M44 30l-4 12M16 22c0-6 6-6 6-12M28 22c0-6 6-6 6-12M40 22c0-4 4-4 4-8" />],
  ['Cerveza & coctelería', 'Cerveza de barril, whisky y cócteles clásicos.', <path key="c" d="M16 12h22l-3 34H19zM38 20h5c3 0 5 2 5 5v7c0 3-2 5-5 5h-6M16 18h22" />],
];
/** Tres pilares de la casa, con íconos de línea dorada. */
export default function Pilares() {
  return (
    <section className="pilares">
      <div className="wrap pilares__grid">
        {P.map(([t, x, ic]) => (
          <div key={t} className="pilar rv">
            <svg viewBox="0 0 56 56" aria-hidden="true">{ic}</svg>
            <h3>{t}</h3>
            <p>{x}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
