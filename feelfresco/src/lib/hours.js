import { HOURS } from '../data';

// Hora actual en Colombia y estado del local (abierto / horario de hoy)
export function bogotaNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = (k) => parts.find((p) => p.type === k)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
  return { day, mins };
}

// índice de la fila del horario: 0 = lunes a jueves, 1 = viernes y sábado, 2 = domingo
export const rowOf = (day) => (day === 0 ? 2 : day >= 5 ? 1 : 0);

export function status() {
  const { day, mins } = bogotaNow();
  const [a, b] = HOURS[day];
  // pasada la medianoche del viernes/sábado se considera aún abierto hasta las 12:00 a. m.
  return { open: mins >= a && mins < b, day, row: rowOf(day) };
}
