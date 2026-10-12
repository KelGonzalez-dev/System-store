// ============================================================
// CAFETOMÁS — carta, métodos de preparación y galería. Textos: [español, inglés].
// Productos y precios de REFERENCIA (excepto los nombres vistos en su Instagram):
// reemplázalos por los reales. Fotos: id de Unsplash o ruta local.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales (de su Instagram, baja resolución): reemplázalas por las originales con el mismo nombre
export const L = {
  pumpkin: '/images/local/pumpkin.jpg',
  cerezas: '/images/local/cerezas.jpg',
  croissant: '/images/local/croissant.jpg',
  aeropress: '/images/local/aeropress.jpg',
  graduados: '/images/local/graduados.jpg',
  bebida: '/images/local/bebida.jpg',
  latte: '/images/local/latte.jpg',
  frappe: '/images/local/frappe.jpg',
  tostada: '/images/local/tostada.jpg',
};

export const CATS = ['espresso', 'metodos', 'autor', 'frias', 'panaderia'];

const M = (id, cat, img, n, d, price, fav = false) => ({ id, cat, img, n, d, price, fav });
const S = (x) => [x, x];

export const MENU = [
  // ---------- Espresso
  M(1, 'espresso', '1510591509098-f4fdc6d0ff04', S('Espresso'), ['Doble carga de café de especialidad', 'Double shot of specialty coffee'], 6000, true),
  M(2, 'espresso', '1497935586351-b67a49e012bf', S('Americano'), ['Espresso con agua caliente', 'Espresso with hot water'], 7000),
  M(3, 'espresso', '1485808191679-5f86510681a2', S('Cortado'), ['Espresso con un toque de leche texturizada', 'Espresso with a touch of textured milk'], 8000),
  M(4, 'espresso', L.latte, ['Capuchino', 'Cappuccino'], ['Espresso, leche texturizada y latte art', 'Espresso, textured milk and latte art'], 10000, true),
  M(5, 'espresso', '1461023058943-07fcbe16d735', S('Latte'), ['Suave y cremoso', 'Smooth and creamy'], 11000),
  M(6, 'espresso', '1577968897966-3d4325b36b61', S('Flat white'), ['Doble ristretto y microespuma sedosa', 'Double ristretto and silky microfoam'], 11000),

  // ---------- Métodos de filtrado
  M(7, 'metodos', '1495474472287-4d71bcdd2085', S('V60'), ['Filtrado limpio y floral, preparado a la vista', 'Clean, floral pour-over brewed in front of you'], 14000, true),
  M(8, 'metodos', '1442512595331-e89e73853f31', S('Chemex'), ['Cuerpo ligero y gran claridad, para compartir', 'Light body and great clarity, to share'], 18000),
  M(9, 'metodos', L.aeropress, S('AeroPress'), ['Intenso y redondo, por inmersión y presión', 'Intense and rounded, by immersion and pressure'], 14000, true),
  M(10, 'metodos', '1514432324607-a09d9b4aefdd', ['Prensa francesa', 'French press'], ['Con cuerpo y textura', 'Full-bodied and textured'], 14000),

  // ---------- De autor
  M(11, 'autor', L.pumpkin, S('Pumpkin Nevado Coffee'), ['Nevado de café con especias de calabaza y crema', 'Blended coffee with pumpkin spice and cream'], 18000, true),
  M(12, 'autor', L.frappe, ['Nevado de café', 'Coffee nevado'], ['Granizado de café de especialidad con crema y caramelo', 'Specialty coffee blended over ice with cream and caramel'], 16000, true),
  M(13, 'autor', L.bebida, ['Espresso tonic', 'Espresso tonic'], ['Tónica, hielo y espresso: burbujeante y cítrico', 'Tonic, ice and espresso: fizzy and citrusy'], 15000),
  M(14, 'autor', '1572442388796-11668a67e53d', ['Mocca de la casa', 'House mocha'], ['Espresso, chocolate y leche', 'Espresso, chocolate and milk'], 13000),

  // ---------- Frías
  M(15, 'frias', '1517701604599-bb29b565090c', ['Cold brew', 'Cold brew'], ['Extracción en frío por 16 horas', 'Cold-steeped for 16 hours'], 12000),
  M(16, 'frias', '1461023058943-07fcbe16d735', ['Latte frío', 'Iced latte'], ['Espresso, leche y hielo', 'Espresso, milk and ice'], 12000),

  // ---------- Panadería
  M(17, 'panaderia', '1555507036-ab1f4038808a', ['Croissant de mantequilla', 'Butter croissant'], ['Hojaldrado y dorado', 'Flaky and golden'], 8000),
  M(18, 'panaderia', L.croissant, ['Croissant sándwich', 'Croissant sandwich'], ['Relleno de jamón, queso y vegetales frescos', 'Filled with ham, cheese and fresh vegetables'], 22000, true),
  M(19, 'panaderia', L.tostada, ['Tostada de la casa', 'House toast'], ['Pan artesanal con jamón serrano y reducción de balsámico', 'Artisan bread with serrano ham and balsamic reduction'], 24000),
];

// Métodos para la calculadora del Coffee Lab (proporción café:agua)
export const METHODS = [
  { id: 'v60', n: 'V60', ratio: 16, temp: '93 °C', grind: ['Media-fina', 'Medium-fine'], time: '2:30 – 3:00', img: '1495474472287-4d71bcdd2085' },
  { id: 'chemex', n: 'Chemex', ratio: 15, temp: '94 °C', grind: ['Media-gruesa', 'Medium-coarse'], time: '4:00', img: '1442512595331-e89e73853f31' },
  { id: 'aeropress', n: 'AeroPress', ratio: 14, temp: '85 °C', grind: ['Media', 'Medium'], time: '1:45', img: L.aeropress },
  { id: 'prensa', n: ['Prensa francesa', 'French press'], ratio: 15, temp: '95 °C', grind: ['Gruesa', 'Coarse'], time: '4:00', img: '1514432324607-a09d9b4aefdd' },
  { id: 'espresso', n: 'Espresso', ratio: 2, temp: '93 °C', grind: ['Fina', 'Fine'], time: '25 – 30 s', img: '1510591509098-f4fdc6d0ff04' },
  { id: 'cold', n: 'Cold brew', ratio: 8, temp: ['Frío', 'Cold'], grind: ['Gruesa', 'Coarse'], time: '16 h', img: '1517701604599-bb29b565090c' },
];

// Fotos de cada paso "Del grano a la taza"
export const JOURNEY_IMG = [L.cerezas, '1611854779393-1b2da9d400fe', '1447933601403-0c6688de566e', '1514432324607-a09d9b4aefdd', L.aeropress, L.latte];

// Galería (prisma 3D)
export const GALLERY = [
  { src: L.latte, t: ['Latte art', 'Latte art'] },
  { src: L.cerezas, t: ['Desde la finca', 'From the farm'] },
  { src: L.pumpkin, t: ['Pumpkin Nevado', 'Pumpkin Nevado'] },
  { src: L.aeropress, t: ['AeroPress', 'AeroPress'] },
  { src: L.croissant, t: ['Croissant sándwich', 'Croissant sandwich'] },
  { src: L.frappe, t: ['Nevado de café', 'Coffee nevado'] },
];
