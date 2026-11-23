// ============================================================
// RED ANGUS STEAK & BEER HOUSE — versión clásica y elegante
// "El mejor Steakhouse de Bogotá" · ¡Llegamos a Chía!
// Lo marcado con ⚠️ hay que confirmarlo con el restaurante.
// ============================================================

export const CONFIG = {
  nombre: 'Red Angus Steak & Beer House',
  instagram: 'redangussteak',
  reservas: 'https://linktr.ee/Redangussteak', // enlace de su biografía
  // ⚠️ WhatsApp de reservas. Si se deja vacío, la reserva se copia y se abre su enlace de reservas.
  whatsapp: '',
  desde: 2012,
};

// ⚠️ Direcciones y horarios por confirmar
export const SEDES = [
  { id: 'bogota', nombre: 'Bogotá', tipo: 'Steakhouse', direccion: 'Dirección por confirmar', horario: { 0: [720, 1080], 1: [720, 1320], 2: [720, 1320], 3: [720, 1320], 4: [720, 1380], 5: [720, 1440], 6: [720, 1440] } },
  { id: 'chia', nombre: 'Chía', tipo: 'Sede campestre', direccion: 'Dirección por confirmar', horario: { 0: [720, 1080], 1: null, 2: [720, 1320], 3: [720, 1320], 4: [720, 1380], 5: [720, 1440], 6: [720, 1440] } },
];

export const fmt = (n) => `$${Number(n).toLocaleString('es-CO')}`;
export const waLink = (t) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;

// Fotos reales de su Instagram (recortadas de las capturas y mejoradas en resolución)
const F = (n) => `/images/fotos/${n}.jpg`;
export const FOTOS = {
  newyork: F('newyork'), comedor: F('comedor'), terraza: F('terraza'), bar: F('bar'), lamparas: F('lamparas'), mesa: F('mesa'),
  pareja: F('pareja'), provoleta: F('provoleta'), pancakes: F('pancakes'), sandwich: F('sandwich'), postre: F('postre'),
  margarita: F('margarita'), whisky: F('whisky'),
};

// ── Cortes de la casa ⚠️ precios de referencia
export const CORTES = [
  { nombre: 'New York', gramos: '350 g', txt: 'Nuestro corte insignia: firme, jugoso y con su borde de grasa dorado al carbón.', precio: 82000, destacado: true },
  { nombre: 'Ribeye', gramos: '400 g', txt: 'El de mayor marmoleo, con todo el sabor del Angus.', precio: 89000 },
  { nombre: 'Tomahawk', gramos: '1 kg', txt: 'Ribeye con su hueso largo, para compartir entre dos.', precio: 210000 },
  { nombre: 'Baby Beef', gramos: '300 g', txt: 'Lomo fino, el corte más tierno de la res.', precio: 68000 },
  { nombre: 'Picanha', gramos: '350 g', txt: 'Con su capa de grasa que lo baña en la parrilla.', precio: 72000 },
  { nombre: 'Punta de anca', gramos: '350 g', txt: 'El clásico colombiano, con su gordito dorado.', precio: 62000 },
];

// ── La carta (todas las secciones a la vista, como una carta impresa) ⚠️ de ejemplo
export const CARTA = [
  { titulo: 'Entradas', items: [
    ['Provoleta al carbón', 'Queso provolone fundido, orégano y tomate confitado.', 32000],
    ['Chorizo santarrosano', 'Con arepa, limón y ají de la casa.', 22000],
    ['Empanadas de carne', 'Tres unidades, con ají.', 18000],
    ['Nachos Red Angus', 'Con carne desmechada, cheddar y guacamole.', 34000],
  ] },
  { titulo: 'Cortes Angus', nota: 'Con un acompañamiento a elección', items: CORTES.map((c) => [`${c.nombre} · ${c.gramos}`, c.txt, c.precio]) },
  { titulo: 'Acompañamientos', items: [
    ['Papas rústicas', 'Con romero y sal marina.', 12000],
    ['Puré trufado', 'Cremoso, con aceite de trufa.', 15000],
    ['Papa criolla', 'Dorada y crocante.', 10000],
    ['Vegetales al grill', 'De temporada.', 13000],
  ] },
  { titulo: 'Burgers & sándwiches', items: [
    ['Angus Burger', 'Carne Angus 200 g, cheddar, tocineta y pan brioche.', 42000],
    ['Sándwich de la casa', 'Carne a la parrilla, queso fundido y salsa de la casa.', 39000],
  ] },
  { titulo: 'Postres', items: [
    ['Pancakes de frutos rojos', 'Con miel de maple y azúcar glas.', 22000],
    ['Postre de la casa', 'Con coulis de frutos rojos.', 19000],
    ['Brownie con helado', 'Caliente, con helado de vainilla.', 18000],
  ] },
  { titulo: 'Bar', items: [
    ['Cerveza de barril', 'Rubia, roja, negra o IPA. Pinta.', 15000],
    ['Margarita', 'Tequila, triple sec y limón, con borde de sal.', 32000],
    ['Whisky con soda', 'Escocés de la casa, con soda y limón.', 34000],
    ['Copa de vino', 'Tinto o blanco de la casa.', 28000],
  ] },
];

// Galería
export const GALERIA = [
  { foto: FOTOS.comedor, txt: 'Nuestro comedor' }, { foto: FOTOS.newyork, txt: 'New York al carbón' }, { foto: FOTOS.terraza, txt: 'Sede campestre, Chía' },
  { foto: FOTOS.margarita, txt: 'Margarita de la casa' }, { foto: FOTOS.lamparas, txt: 'Detalles de la casa' }, { foto: FOTOS.pancakes, txt: 'Pancakes de frutos rojos' },
  { foto: FOTOS.pareja, txt: 'Nuestros clientes' }, { foto: FOTOS.provoleta, txt: 'Para compartir' }, { foto: FOTOS.bar, txt: 'El bar' },
  { foto: FOTOS.sandwich, txt: 'Sándwich de la casa' }, { foto: FOTOS.whisky, txt: 'Coctelería' }, { foto: FOTOS.postre, txt: 'Postre de la casa' },
];
