// Hoja de palmera (silueta) para decorar esquinas; se mece con CSS
export default function Palm({ className = '', color = '#F27BBF', ...rest }) {
  return (
    <svg viewBox="0 0 220 220" className={`palm ${className}`} aria-hidden="true" {...rest}>
      <g fill={color}>
        <path d="M10 214C40 150 90 98 160 70c-50 40-90 90-112 148z" />
        <path d="M150 74c-18 6-34 4-46-6 16-2 30-2 46 6zM132 84c-16 10-34 12-48 4 14-6 30-8 48-4zM114 98c-14 12-32 18-48 12 12-8 28-12 48-12zM98 114c-12 14-28 22-46 18 10-10 26-16 46-18zM84 132c-10 16-24 26-42 26 8-12 22-20 42-26zM72 152c-8 16-20 28-36 30 6-12 18-22 36-30z" />
        <path d="M154 72c4-18 16-30 32-34-2 16-14 28-32 34zM142 80c10-16 26-24 42-24-6 14-22 22-42 24zM126 92c12-14 30-20 46-16-8 12-26 18-46 16zM110 106c14-12 32-16 48-10-10 10-28 14-48 10zM96 124c14-10 32-12 46-4-12 8-30 10-46 4zM84 144c14-8 30-8 44 2-14 6-30 6-44-2z" />
      </g>
    </svg>
  );
}
