// Siluetas de botellas y productos (SVG propio, liviano y nítido)
export function Bottle({ id, color }) {
  const glass = 'rgba(255,255,255,0.08)';
  const shapes = {
    cerveza: <g><rect x="44" y="10" width="12" height="10" rx="2" fill="#d9b34a" /><path d="M45 20h10v22c0 6 9 10 9 22v74c0 5-4 8-8 8H44c-4 0-8-3-8-8V64c0-12 9-16 9-22z" fill={color} /><rect x="38" y="84" width="24" height="26" rx="3" fill="#f6e7c1" /></g>,
    ron: <g><rect x="43" y="8" width="14" height="14" rx="3" fill="#1d1d1d" /><path d="M44 22h12v16c0 4 16 8 16 22v80c0 6-5 10-10 10H38c-5 0-10-4-10-10V60c0-14 16-18 16-22z" fill={color} /><rect x="32" y="82" width="36" height="30" rx="4" fill="#efe1c0" /></g>,
    tequila: <g><rect x="42" y="6" width="16" height="16" rx="4" fill="#3a2a1a" /><path d="M43 22h14v10l18 20v86c0 6-4 10-10 10H35c-6 0-10-4-10-10V52l18-20z" fill={color} /><path d="M33 86h34v24H33z" fill="#1d3b2f" /></g>,
    whisky: <g><rect x="40" y="6" width="20" height="14" rx="4" fill="#2a1a0a" /><path d="M42 20h16v12h14c4 0 6 3 6 6v104c0 5-4 8-8 8H30c-4 0-8-3-8-8V38c0-3 2-6 6-6h14z" fill={color} /><rect x="28" y="78" width="44" height="34" rx="2" fill="#1b1b1b" stroke="#d9b34a" /></g>,
    granizados: <g><path d="M26 52h48l-6 92c0 4-3 6-6 6H38c-3 0-6-2-6-6z" fill={glass} stroke="rgba(255,255,255,0.4)" /><path d="M30 70h40l-5 72H35z" fill={color} /><rect x="56" y="18" width="4" height="56" rx="2" fill="#f5f5f5" transform="rotate(12 58 46)" /><ellipse cx="50" cy="56" rx="26" ry="10" fill="#fff6" /></g>,
    snacks: <g><path d="M18 92h64l-8 50c-1 5-4 8-9 8H35c-5 0-8-3-9-8z" fill={color} /><g fill="#f6d27a"><circle cx="34" cy="86" r="10" /><circle cx="52" cy="80" r="12" /><circle cx="68" cy="88" r="10" /><circle cx="44" cy="74" r="8" /></g></g>,
  };
  return <svg viewBox="0 0 100 160" className="bottle-svg" aria-hidden="true">{shapes[id]}</svg>;
}

export function Product({ kind, c }) {
  const s = {
    jar: <g><rect x="22" y="40" width="56" height="16" rx="6" fill="#1b1b1b" /><rect x="20" y="54" width="60" height="56" rx="12" fill={c} /><rect x="30" y="70" width="40" height="22" rx="3" fill="#f3e6c5" /><rect x="26" y="60" width="6" height="40" rx="3" fill="#fff3" /></g>,
    dropper: <g><rect x="44" y="12" width="12" height="22" rx="5" fill="#1b1b1b" /><rect x="40" y="32" width="20" height="10" rx="2" fill="#d9b34a" /><rect x="32" y="42" width="36" height="68" rx="10" fill={c} /><rect x="38" y="62" width="24" height="28" rx="3" fill="#f3e6c5" /><rect x="36" y="48" width="5" height="54" rx="2" fill="#fff3" /></g>,
    bottle: <g><rect x="42" y="8" width="16" height="16" rx="3" fill="#1b1b1b" /><rect x="30" y="22" width="40" height="88" rx="12" fill={c} /><rect x="36" y="54" width="28" height="34" rx="3" fill="#f3e6c5" /><rect x="34" y="30" width="5" height="74" rx="2" fill="#fff3" /></g>,
    flask: <g><rect x="42" y="10" width="16" height="14" rx="3" fill="#d9b34a" /><path d="M40 24h20v10c12 4 18 14 18 26v42c0 5-4 8-8 8H30c-4 0-8-3-8-8V60c0-12 6-22 18-26z" fill={c} /><rect x="32" y="66" width="36" height="24" rx="3" fill="#f3e6c5" /></g>,
    shaker: <g><rect x="34" y="20" width="32" height="14" rx="4" fill="#1b1b1b" /><g fill="#666"><circle cx="42" cy="27" r="1.5" /><circle cx="50" cy="27" r="1.5" /><circle cx="58" cy="27" r="1.5" /></g><rect x="30" y="34" width="40" height="76" rx="8" fill={c} /><rect x="36" y="58" width="28" height="30" rx="3" fill="#f3e6c5" /></g>,
  };
  return <svg viewBox="0 0 100 120" className="prod-svg" aria-hidden="true"><ellipse cx="50" cy="114" rx="34" ry="4" fill="#0008" />{s[kind]}</svg>;
}
