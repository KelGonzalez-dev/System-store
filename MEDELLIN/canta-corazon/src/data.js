// ============================================================
// CANTA CORAZÓN · SALOON SENTIMENTAL — Medellín
// Lo marcado con ⚠️ hay que confirmarlo con el bar.
// ============================================================

export const CONFIG = {
  nombre: 'Canta Corazón',
  instagram: 'cantacorazon.medellin',
  direccion: 'Carrera 33 #7-27, El Poblado, Medellín',
  carta: 'https://menupp.co/cantacorazon', // enlace de su biografía
  // ⚠️ WhatsApp de reservas (no aparece en las capturas). Si se deja vacío, la reserva se copia y se abre Instagram.
  whatsapp: '',
  seguidores: '5.991',
};

// ⚠️ Horario de referencia: [apertura, cierre] en minutos (cierre > 1440 = después de medianoche)
export const HORARIO = { 0: null, 1: null, 2: null, 3: [1140, 1560], 4: [1140, 1560], 5: [1140, 1620], 6: [1140, 1620] };

export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`);
export const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`;
export const waLink = (t) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;

// ── Noches de la semana como cartas de lotería ⚠️ programación de ejemplo
export const NOCHES = [
  { num: 1, carta: 'El Corazón', dibujo: 'corazon', foto: '/images/fotos/vaquera-risa.jpg', dia: 'Miércoles', titulo: 'Karaoke sentimental', txt: 'Micrófono abierto para cantarle a quien te rompió el corazón. El público vota la mejor interpretación.' },
  { num: 2, carta: 'La Bota', dibujo: 'bota', foto: '/images/fotos/botas.jpg', dia: 'Jueves', titulo: 'Noche vaquera', txt: 'Country, rancheras y sombreros. Clase de baile en línea a las 9:00 p. m.' },
  { num: 3, carta: 'La Estrella', dibujo: 'estrella', foto: '/images/fotos/brindis.jpg', dia: 'Viernes', titulo: 'Despecho & cantina', txt: 'Música popular, despecho del bueno y tequila para el alma.' },
  { num: 4, carta: 'El Sombrero', dibujo: 'sombrero', foto: '/images/fotos/saloon-lleno.jpg', dia: 'Sábado', titulo: 'Saloon Party', txt: 'La noche grande: DJ en vivo, sombreros, shots y el saloon lleno hasta el amanecer.' },
  { num: 5, carta: 'La Novia', dibujo: 'novia', foto: '/images/fotos/amigas-sombreros.jpg', dia: 'Todas las noches', titulo: 'Despedidas de soltera', txt: 'Mesa reservada, sombreros rosados, banda "Bride" y shots de bienvenida.' },
];

// ── Tragos (carteles de "Se busca") ⚠️ carta de ejemplo: la carta real está en su enlace menupp
export const TRAGOS = [
  { nombre: 'Flechazo', txt: 'Tequila, maracuyá, chile y un toque de amor a primera vista.', precio: 34000, dibujo: 'coctel', color: '#E2522B' },
  { nombre: 'Despecho', txt: 'Mezcal ahumado, toronja y sal de chile. Para olvidar.', precio: 36000, dibujo: 'coctel', color: '#8E2B4A' },
  { nombre: 'Margarita Sentimental', txt: 'Tequila, fresa, limón y borde de sal rosada.', precio: 32000, dibujo: 'margarita', color: '#F06B8A' },
  { nombre: 'Paloma Vaquera', txt: 'Tequila, soda de toronja y limón. La clásica del saloon.', precio: 30000, dibujo: 'coctel', color: '#F39A6B' },
  { nombre: 'Michelada del Saloon', txt: 'Cerveza, limón, sal y salsas de la casa.', precio: 18000, dibujo: 'cerveza', color: '#E9A23B' },
  { nombre: 'Shot de tequila', txt: 'Con sal y limón. Para brindar por los que ya no están.', precio: 14000, dibujo: 'shot', color: '#E2B33B' },
];

// ── Despedidas de soltera (destacado "Bride" de su Instagram) ⚠️ paquete de ejemplo
export const DESPEDIDA = ['Mesa reservada para el grupo', 'Sombreros vaqueros rosados', 'Banda "Bride" para la novia', 'Shots de bienvenida', 'Canción dedicada en la noche'];

// ── Fotos reales de su Instagram (recortadas de las capturas y mejoradas en resolución)
const F = (n) => `/images/fotos/${n}.jpg`;
export const FOTOS = {
  vaqueraRosa: F('vaquera-rosa'), saloonLleno: F('saloon-lleno'), caballo: F('caballo'), vaqueraRisa: F('vaquera-risa'),
  botas: F('botas'), amigasSombreros: F('amigas-sombreros'), amigasPaz: F('amigas-paz'), brindis: F('brindis'),
  fiestaBengalas: F('fiesta-bengalas'), botellaBengala: F('botella-bengala'), vaqueraSombrero: F('vaquera-sombrero'),
  vaqueroBn: F('vaquero-bn'), floresBn: F('flores-bn'), chicasBn: F('chicas-bn'), guante: F('guante'), mesa: F('mesa'), cantaRecuerdo: F('canta-recuerdo'),
};

// Galería fotomatón: 3 tiras de 4 fotos
export const TIRAS = [
  [{ foto: FOTOS.vaqueraRosa, arte: 'sombrero' }, { foto: FOTOS.saloonLleno, arte: 'estrella' }, { foto: FOTOS.botas, arte: 'bota' }, { foto: FOTOS.vaqueraRisa, arte: 'corazon' }],
  [{ foto: FOTOS.amigasPaz, arte: 'estrella' }, { foto: FOTOS.fiestaBengalas, arte: 'sombrero' }, { foto: FOTOS.caballo, arte: 'bota' }, { foto: FOTOS.vaqueraSombrero, arte: 'sombrero' }],
  [{ foto: FOTOS.brindis, arte: 'shot' }, { foto: FOTOS.vaqueroBn, arte: 'sombrero' }, { foto: FOTOS.botellaBengala, arte: 'estrella' }, { foto: FOTOS.floresBn, arte: 'corazon' }],
];
// Cinta de fotos del ambiente (sección "El saloon")
export const AMBIENTE = [FOTOS.saloonLleno, FOTOS.vaqueraRosa, FOTOS.amigasSombreros, FOTOS.botas, FOTOS.fiestaBengalas, FOTOS.vaqueraRisa, FOTOS.caballo, FOTOS.brindis, FOTOS.cantaRecuerdo, FOTOS.guante];
export const HERO_FOTO = FOTOS.amigasSombreros;
