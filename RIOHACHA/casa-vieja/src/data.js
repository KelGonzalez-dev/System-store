// ============================================================
// CASA VIEJA — carta, horario y galería.
// Textos: [español, inglés]. Platos y precios de REFERENCIA:
// reemplázalos por los reales de Casa Vieja.
// Fotos: id de Unsplash o ruta local '/images/local/...'.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales (de su Instagram, baja resolución): reemplázalas por las originales con el mismo nombre
export const L = {
  fachada: '/images/local/fachada.jpg',
  espresso: '/images/local/espresso.jpg',
  capuchino: '/images/local/capuchino.jpg',
  michelada: '/images/local/michelada.jpg',
  barista: '/images/local/barista.jpg',
  parfait: '/images/local/parfait.jpg',
  tortas: '/images/local/tortas.jpg',
  torta: '/images/local/torta-cafe.jpg',
};

// Horario (hora de Colombia). Minutos desde la medianoche; si cierra después de medianoche, el cierre pasa de 1440.
// 0 = domingo … 6 = sábado. null = sin dato (confírmalo con el cliente).
export const HOURS = {
  1: [480, 1320],        // lunes 8 a. m. – 10 p. m.
  2: [480, 1320],        // martes
  3: [480, 1320],        // miércoles
  4: [480, 1500],        // jueves 8 a. m. – 1 a. m.
  5: [480, 1620],        // viernes 8 a. m. – 3 a. m.
  6: [480, 1620],        // sábado 8 a. m. – 3 a. m.
  0: null,               // domingo: confirmar
};

export const CATS = ['cafe', 'desayunos', 'tortas', 'frias', 'bar'];

const M = (id, cat, img, n, d, price, fav = false) => ({ id, cat, img, n, d, price, fav });
const S = (x) => [x, x];

export const MENU = [
  // ---------- Café colombiano
  M(1, 'cafe', L.espresso, S('Espresso'), ['Doble carga de café de origen colombiano', 'Double shot of Colombian single-origin coffee'], 5000, true),
  M(2, 'cafe', '1509042239860-f550ce710b93', ['Tinto', 'Tinto'], ['El clásico café negro colombiano', 'The classic Colombian black coffee'], 3000),
  M(3, 'cafe', '1497935586351-b67a49e012bf', S('Americano'), ['Espresso alargado con agua caliente', 'Espresso lengthened with hot water'], 5000),
  M(4, 'cafe', L.capuchino, ['Capuchino', 'Cappuccino'], ['Espresso, leche vaporizada y espuma con arte latte', 'Espresso, steamed milk and foam with latte art'], 9000, true),
  M(5, 'cafe', '1461023058943-07fcbe16d735', S('Latte'), ['Suave y cremoso, con mucha leche', 'Smooth and creamy, with plenty of milk'], 9000),
  M(6, 'cafe', '1572442388796-11668a67e53d', ['Mocaccino', 'Mocha'], ['Café, chocolate y leche vaporizada', 'Coffee, chocolate and steamed milk'], 11000),
  M(7, 'cafe', '1517701604599-bb29b565090c', ['Café frío', 'Iced coffee'], ['Café de origen con hielo y leche. Para los días cálidos', 'Single-origin coffee over ice with milk. For warm days'], 12000, true),
  M(8, 'cafe', '1572490122747-3968b75cc699', ['Frappé de café', 'Coffee frappé'], ['Granizado de café con crema', 'Blended iced coffee with cream'], 14000),

  // ---------- Desayunos
  M(9, 'desayunos', L.parfait, ['Parfait saludable', 'Healthy parfait'], ['Yogur, granola, frutas frescas y miel', 'Yogurt, granola, fresh fruit and honey'], 16000, true),
  M(10, 'desayunos', '1525351484163-7529414344d8', ['Huevos al gusto', 'Eggs your way'], ['Con arepa, queso y café o jugo', 'With arepa, cheese and coffee or juice'], 15000),
  M(11, 'desayunos', '1533089860892-a7c6f0a88666', ['Calentado costeño', 'Coastal calentado'], ['Arroz, fríjol, huevo, carne y arepa', 'Rice, beans, egg, meat and arepa'], 18000),
  M(12, 'desayunos', '1484723091739-30a097e8f929', ['Tostadas francesas', 'French toast'], ['Con frutas, miel y canela', 'With fruit, honey and cinnamon'], 16000),
  M(13, 'desayunos', '1562376552-0d160a2f238d', ['Waffles con frutas', 'Waffles with fruit'], ['Waffles dorados con frutas y arequipe', 'Golden waffles with fruit and dulce de leche'], 17000),

  // ---------- Tortas
  M(14, 'tortas', L.tortas, ['Torta de zanahoria', 'Carrot cake'], ['Hecha en casa, con ingredientes naturales y mucho amor', 'Homemade with natural ingredients and lots of love'], 10000, true),
  M(15, 'tortas', L.torta, ['Torta de chocolate', 'Chocolate cake'], ['Húmeda, intensa y perfecta con un café', 'Moist, intense and perfect with a coffee'], 10000, true),
  M(16, 'tortas', '1533134242443-d4fd215305ad', S('Cheesecake'), ['Cremoso, con salsa de frutos rojos', 'Creamy, with red berry sauce'], 12000),
  M(17, 'tortas', '1488477181946-6428a0291777', ['Tres leches', 'Tres leches'], ['La clásica, bien fría', 'The classic, served cold'], 10000),

  // ---------- Bebidas frías
  M(18, 'frias', '1600271886742-f049cd451bba', ['Jugos naturales', 'Fresh juices'], ['En agua o en leche, de la fruta del día', 'With water or milk, fruit of the day'], 9000),
  M(19, 'frias', '1556679343-c7306c1976bc', ['Limonada de coco', 'Coconut lemonade'], ['Cremosa y bien fría', 'Creamy and ice cold'], 12000),
  M(20, 'frias', '1572490122747-3968b75cc699', ['Malteadas', 'Milkshakes'], ['Vainilla, chocolate o fresa', 'Vanilla, chocolate or strawberry'], 14000),

  // ---------- Bar
  M(21, 'bar', L.michelada, S('Michelada'), ['Con limón, sal y escarchado de la casa', 'With lime, salt and the house rim'], 12000, true),
  M(22, 'bar', '1535958636474-b021ee887b13', ['Cerveza nacional', 'Local beer'], ['Bien fría', 'Ice cold'], 7000),
  M(23, 'bar', '1551538827-9c037cb4f32a', S('Mojito'), ['Ron, hierbabuena, limón y soda', 'Rum, mint, lime and soda'], 22000),
  M(24, 'bar', '1514362545857-3bc16c4c7d1b', ['Cóctel de la casa', 'House cocktail'], ['Pregúntale al barman por el de hoy', 'Ask the bartender about today’s'], 25000, true),
  M(25, 'bar', '1587223962930-cb7f31384c19', ['Piña colada', 'Piña colada'], ['Piña, coco y ron', 'Pineapple, coconut and rum'], 22000),
  M(26, 'bar', '1556679343-c7306c1976bc', ['Gin tonic', 'Gin & tonic'], ['Con frutos y especias', 'With fruit and spices'], 28000),
];

// Los 5 "momentos" (como sus historias destacadas de Instagram)
export const MOMENTS = [
  { id: 'cafe', img: L.espresso, icon: '☕' },
  { id: 'desayunos', img: L.parfait, icon: '🥣' },
  { id: 'tortas', img: L.torta, icon: '🍰' },
  { id: 'bar', img: L.michelada, icon: '🍸' },
  { id: 'karaoke', img: L.barista, icon: '🎤' },
];

// Galería (fotos reales)
export const GALLERY = [
  { src: L.fachada, t: ['La entrada de la casa', 'The entrance'] },
  { src: L.espresso, t: ['Espresso de origen', 'Single-origin espresso'] },
  { src: L.torta, t: ['Un momento solo para ti', 'A moment just for you'] },
  { src: L.michelada, t: ['De noche, la casa se enciende', 'At night, the house lights up'] },
  { src: L.parfait, t: ['Desayuna saludable', 'Eat a healthy breakfast'] },
  { src: L.barista, t: ['Atendidos como en casa', 'Served like at home'] },
  { src: L.capuchino, t: ['Arte en cada taza', 'Art in every cup'] },
  { src: L.tortas, t: ['Tortas hechas en casa', 'Homemade cakes'] },
];
