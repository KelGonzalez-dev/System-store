import { HOURS } from '../data';

export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, min: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
}
export function fmtMin(m, lang = 'es') {
  const h = Math.floor(m / 60) % 24, mi = m % 60, h12 = h % 12 || 12;
  const s = lang === 'en' ? (h < 12 ? 'a.m.' : 'p.m.') : (h < 12 ? 'a. m.' : 'p. m.');
  return `${h12}${mi ? `:${String(mi).padStart(2, '0')}` : ''} ${s}`;
}
export function status() {
  const { day, min } = bogotaNow();
  const shifts = HOURS[day] || [];
  const now = shifts.find(([a, b]) => min >= a && min < b);
  return now ? { open: true, close: now[1], day } : { open: false, day };
}
