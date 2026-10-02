import { LOCAL } from '../data';

// Logotipo de texto: letras altas y condensadas como el letrero del local
export function Wordmark({ className = '', glow = false }) {
  return (
    <span className={`wordmark ${glow ? 'neon-text' : ''} ${className}`} aria-label="The Marquesa">
      <span className="wm-the">The</span>
      <span className="wm-name">Marquesa</span>
    </span>
  );
}

// Logo circular real (busto con rosas)
export function LogoBadge({ className = 'w-10' }) {
  return <img src={LOCAL.logo} alt="" className={`rounded-full ${className}`} draggable="false" />;
}
