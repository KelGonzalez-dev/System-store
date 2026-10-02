export default function AdminTransition({ label }) {
  return (
    <div className="admin-overlay fixed inset-0 z-[210] flex flex-col items-center justify-center bg-forest/[.97] px-6 backdrop-blur-sm">
      <div className="relative grid h-32 w-32 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#fcbe39"
            strokeWidth="3"
            strokeLinecap="round"
            className="admin-ring"
          />
        </svg>
        <div className="animate-pulse-soft grid h-16 w-16 place-items-center rounded-full bg-cream p-2 shadow-lg">
          <img src="/logo.webp" alt="" className="h-full w-full object-contain" draggable="false" />
        </div>
      </div>
      <p className="mt-6 text-center text-sm font-semibold tracking-wide text-white/85">{label}</p>
    </div>
  );
}
