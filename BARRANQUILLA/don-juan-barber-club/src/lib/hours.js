export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t)?.value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')), ymd: `${g('year')}-${g('month')}-${g('day')}` };
}
export const fmtMin = (m) => { const h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${h < 12 ? 'a. m.' : 'p. m.'}`; };
export function isOpen(hours) { const { day, min } = bogotaNow(); const h = hours[day]; return !!h && min >= h[0] && min < h[1]; }
export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
