// ============================================================
// CARTA — edita aquí platos, precios (COP) y fotos.
// Textos: [español, inglés]. Platos y precios de REFERENCIA:
// reemplázalos por los reales de Quile Parrilla.
// Fotos: id de Unsplash o ruta local '/images/local/...'.
// ============================================================

export const U = (id, w = 800) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales de Quile (de su Instagram y Google; baja resolución).
// Reemplázalas por las originales con el mismo nombre en /public/images/local/.
export const L = {
  espada: '/images/local/espada.jpg',
  picada: '/images/local/picada.jpg',
  pincho: '/images/local/pincho.jpg',
  costillas: '/images/local/costillas.jpg',
  carne: '/images/local/carne-salsa.jpg',
  mazorcada: '/images/local/mazorcada.jpg',
  salchipapa: '/images/local/salchipapa.jpg',
  salchipapa2: '/images/local/salchipapa2.jpg',
  gratinada: '/images/local/salchipapa-gratinada.jpg',
  salchiquiloca: '/images/local/salchiquiloca.jpg',
  nachos: '/images/local/nachos.jpg',
  vino: '/images/local/vino.jpg',
  ambiente: '/images/local/ambiente.jpg',
  interior: '/images/local/interior.jpg',
  parrillero: '/images/local/parrillero.jpg',
  logo: '/images/local/logo-blanco.jpg',
  coctel: '/images/local/coctel-azul.jpg',
  limonada: '/images/local/limonada-quile.jpg',
  fajita: '/images/local/fajita.jpg',
};

export const CATS = ['parrilla', 'compartir', 'salchipapas', 'hamburguesas', 'sandwiches', 'perros', 'fajitas', 'mazorcadas', 'entradas', 'cocteles', 'bebidas'];

// Categorías que se muestran como lista compacta (nombre y precio), con una foto grande de la categoría
export const COMPACT = { bebidas: L.limonada };

// f: c = favorito, s = picante · p = personas (para compartir)
const M = (id, cat, img, n, d, price, f = '', p = 0) => ({ id, cat, img, n, d, price, fav: f.includes('c'), hot: f.includes('s'), people: p });
const S = (x) => [x, x];

export const MENU = [
  // ---------- Parrilla
  M(1, 'parrilla', '1600891964092-4316c288032e', ['Churrasco 300 g', 'Churrasco 300 g'],
    ['Corte de res al carbón con papa a la francesa, ensalada y chimichurri', 'Charcoal-grilled beef with fries, salad and chimichurri'], 42000, 'c'),
  M(2, 'parrilla', L.carne, ['Punta de anca', 'Picanha'],
    ['Jugosa y dorada a la brasa, con papa criolla y arepa', 'Juicy and golden on the grill, with creole potatoes and arepa'], 44000, 'c'),
  M(3, 'parrilla', '1558030006-450675393462', ['Lomo de res', 'Beef tenderloin'],
    ['Medallón de lomo con salsa de la casa y papas', 'Tenderloin medallion with house sauce and fries'], 40000),
  M(4, 'parrilla', L.costillas, ['Costillas BBQ', 'BBQ ribs'],
    ['Costillas de cerdo glaseadas en BBQ, con papas y ensalada', 'Pork ribs glazed in BBQ, with fries and salad'], 38000),
  M(5, 'parrilla', '1532550907401-a500c9a57435', ['Pechuga a la parrilla', 'Grilled chicken breast'],
    ['Pechuga marinada a las finas hierbas, papas y ensalada', 'Herb-marinated chicken breast, fries and salad'], 32000),
  M(6, 'parrilla', L.pincho, ['Mixto parrillero', 'Mixed grill'],
    ['Res, cerdo, pollo y chorizo con papa, yuca y arepa', 'Beef, pork, chicken and chorizo with fries, yuca and arepa'], 48000, 'c'),

  // ---------- Para compartir
  M(7, 'compartir', L.espada, ['Espada Quile', 'Quile skewer'],
    ['El pincho gigante de la casa: chorizo, res, cerdo y pollo, servido en la mesa con papas', 'The giant house skewer: chorizo, beef, pork and chicken, served at the table with fries'], 120000, 'c', 4),
  M(8, 'compartir', L.picada, ['Picada Quile', 'Quile platter'],
    ['Carnes a la brasa, chorizo, morcilla, papa criolla, yuca y patacón', 'Grilled meats, chorizo, blood sausage, creole potatoes, yuca and plantain'], 85000, '', 3),
  M(9, 'compartir', L.parrillero, ['Picada familiar', 'Family platter'],
    ['Para toda la mesa: el doble de carnes, papas, patacones y salsas', 'For the whole table: double the meats, fries, plantains and sauces'], 140000, '', 6),

  // ---------- Salchipapas (los tamaños de la casa)
  M(10, 'salchipapas', L.salchipapa, ['Salchipapa personal', 'Personal salchipapa'],
    ['Papa a la francesa, salchicha, queso rallado y salsas', 'French fries, sausage, grated cheese and sauces'], 18000, '', 1),
  M(11, 'salchipapas', L.gratinada, ['Salchipapa gratinada', 'Gratinated salchipapa'],
    ['Bañada en queso gratinado con maíz tierno', 'Topped with melted cheese and sweet corn'], 28000, '', 2),
  M(12, 'salchipapas', L.salchiquiloca, ['Salchiquiloca', 'Salchiquiloca'],
    ['La loca de la casa: pollo, carne, chorizo, tocineta, maíz y queso', 'The crazy one: chicken, beef, chorizo, bacon, corn and cheese'], 32000, 'c', 2),
  M(13, 'salchipapas', L.salchipapa2, ['Salchiguajira', 'Salchiguajira'],
    ['Con carne desmechada, suero costeño y queso', 'With shredded beef, Colombian sour cream and cheese'], 30000, '', 2),
  M(14, 'salchipapas', L.salchipapa, ['Tronco de salchipapa', 'Salchipapa log'],
    ['Para compartir entre dos o tres', 'To share between two or three'], 45000, '', 3),
  M(15, 'salchipapas', L.salchipapa2, ['Salchipapa tipo burro', 'Donkey-size salchipapa'],
    ['Grande de verdad: para cuatro o cinco personas', 'Seriously big: for four or five people'], 85000, '', 5),
  M(16, 'salchipapas', L.gratinada, ['Salchipapa tipo elefante', 'Elephant-size salchipapa'],
    ['Para seis a ocho personas', 'For six to eight people'], 110000, '', 8),
  M(17, 'salchipapas', L.salchiquiloca, ['Salchipapa tipo ballena', 'Whale-size salchipapa'],
    ['La leyenda de Quile: para ocho a diez personas', 'The Quile legend: for eight to ten people'], 140000, 'c', 10),

  // ---------- Hamburguesas
  M(18, 'hamburguesas', '1568901346375-23c9450c58cd', ['Hamburguesa Quile', 'Quile burger'],
    ['Doble carne a la parrilla, tocineta, queso y salsas, con papas', 'Double grilled patty, bacon, cheese and sauces, with fries'], 28000, 'c'),
  M(19, 'hamburguesas', '1553979459-d2229ba7433b', ['Americana', 'American'],
    ['Carne a la parrilla, queso, lechuga y tomate, con papas', 'Grilled patty, cheese, lettuce and tomato, with fries'], 22000),
  M(20, 'hamburguesas', '1550547660-d9450f859349', ['De pollo', 'Chicken burger'],
    ['Pechuga a la parrilla, queso y salsa de la casa, con papas', 'Grilled chicken breast, cheese and house sauce, with fries'], 22000),
  M(21, 'hamburguesas', '1586190848861-99aa4a171e90', ['Gratinada', 'Gratinated'],
    ['Con queso gratinado y maíz tierno, con papas', 'With melted cheese and sweet corn, with fries'], 26000),

  // ---------- Mazorcadas
  M(22, 'mazorcadas', L.mazorcada, ['Mazorcada sencilla', 'Classic mazorcada'],
    ['Maíz tierno, queso gratinado, papa ripio y salsas', 'Sweet corn, melted cheese, potato sticks and sauces'], 24000),
  M(23, 'mazorcadas', L.mazorcada, ['Mazorcada mixta', 'Mixed mazorcada'],
    ['Con pollo, carne y chorizo bajo el queso gratinado', 'With chicken, beef and chorizo under melted cheese'], 30000, 'c'),

  // ---------- Entradas
  M(24, 'entradas', L.nachos, ['Nachos Quile', 'Quile nachos'],
    ['Tostadas de maíz, carne, suero costeño, guacamole y salsa cheddar', 'Corn chips, beef, Colombian sour cream, guacamole and cheddar'], 26000, 's'),
  M(25, 'entradas', '1555939594-58d7cb561ad1', ['Chorizo con arepa', 'Chorizo with arepa'],
    ['Chorizo a la brasa con arepa y limón', 'Grilled chorizo with arepa and lime'], 12000),
  M(26, 'entradas', '1573080496219-bb080dd4f877', ['Papas a la francesa', 'French fries'],
    ['Porción crocante con salsas de la casa', 'Crispy portion with house sauces'], 9000),

  // ---------- Sándwiches cubanos (carta real)
  M(31, 'sandwiches', '1528735602780-2552fd46c7af', S('Cubano ejecutivo'), ['Sándwich cubano clásico de la casa', 'Classic house Cuban sandwich'], 20000),
  M(32, 'sandwiches', '1553909489-cd47e0907980', ['Cubano de pollo', 'Chicken Cuban sandwich'], ['Con pollo a la parrilla, queso y salsas', 'With grilled chicken, cheese and sauces'], 32000),
  M(33, 'sandwiches', '1539252554453-80ab65ce3586', ['Cubano suizo ranchero', 'Swiss ranch Cuban sandwich'], ['Con salchicha suiza ranchera, queso y salsas', 'With Swiss ranch sausage, cheese and sauces'], 32000),
  M(34, 'sandwiches', '1550507992-eb63ffee0847', ['Cubano al Quile', 'Quile Cuban sandwich'], ['El cubano de la casa, con todo', 'The house Cuban sandwich, fully loaded'], 36000, 'c'),

  // ---------- Perros calientes (carta real)
  M(35, 'perros', '1612392062631-94dd858cba88', ['Perro argentino', 'Argentine hot dog'], ['Con chorizo y chimichurri', 'With chorizo and chimichurri'], 22000),
  M(36, 'perros', '1619740455993-9e612b1af08a', ['Perro hawaiano', 'Hawaiian hot dog'], ['Con piña, jamón y queso', 'With pineapple, ham and cheese'], 23000),
  M(37, 'perros', '1612392166886-ee8475b03af2', ['Perro sinvergüenza', 'Sinvergüenza hot dog'], ['El atrevido de la casa', 'The cheeky one of the house'], 23000),
  M(38, 'perros', '1613454320437-0c228c8b1723', ['Perro suizo', 'Swiss hot dog'], ['Con salchicha suiza y queso', 'With Swiss sausage and cheese'], 26000),
  M(39, 'perros', '1599599810694-b5b37304c041', ['Perro Quiloco', 'Quiloco hot dog'], ['Cargado al estilo Quile', 'Loaded Quile style'], 38000, 'c'),
  M(40, 'perros', '1541214113241-21578d2d9b62', ['Perro Bin Bang', 'Bin Bang hot dog'], ['El más grande de la casa', 'The biggest one in the house'], 42000),

  // ---------- Fajitas quileñas (carta real)
  M(41, 'fajitas', L.fajita, ['Fajita de carne o pollo', 'Beef or chicken fajita'], ['Bañada en salsa de queso, cheddar y tocineta', 'Topped with cheese sauce, cheddar and bacon'], 32000, 'c'),
  M(42, 'fajitas', L.fajita, ['Fajita mixta', 'Mixed fajita'], ['Carne y pollo con salsa de queso, cheddar y tocineta', 'Beef and chicken with cheese sauce, cheddar and bacon'], 34000),

  // ---------- Quile cócteles (carta real)
  M(43, 'cocteles', '1556679343-c7306c1976bc', S('Soda italiana'), ['Refrescante y burbujeante', 'Refreshing and bubbly'], 15000),
  M(44, 'cocteles', '1600271886742-f049cd451bba', S('Michelada tropical Hatsu'), ['Michelada con té Hatsu y frutas', 'Michelada with Hatsu tea and fruits'], 15000),
  M(45, 'cocteles', '1551538827-9c037cb4f32a', ['Mojito paisa o ruso', 'Paisa or Russian mojito'], ['Hierbabuena, limón y tu licor favorito', 'Mint, lime and your favorite spirit'], 20000, 'c'),
  M(46, 'cocteles', '1514362545857-3bc16c4c7d1b', S('Riohacha Sunrise'), ['El atardecer guajiro en una copa', 'The Guajira sunset in a glass'], 20000, 'c'),
  M(47, 'cocteles', '1575023782549-62ca0d244b39', S('Martini mexicano'), ['Con tequila y limón', 'With tequila and lime'], 20000),
  M(48, 'cocteles', L.coctel, S('Ocean Blue Margarita'), ['Margarita azul con borde de sal y cereza', 'Blue margarita with salted rim and cherry'], 20000, 'c'),
  M(49, 'cocteles', '1536935338788-846bb9981813', ['Verano rojo', 'Red summer'], ['Frutos rojos y mucho hielo', 'Red berries and plenty of ice'], 20000),
  M(50, 'cocteles', '1587223962930-cb7f31384c19', ['Piña colada', 'Piña colada'], ['Piña, coco y ron', 'Pineapple, coconut and rum'], 20000),
  M(51, 'cocteles', '1497534446932-c925b458314e', ['Sueño rosa', 'Pink dream'], ['Dulce, suave y rosado', 'Sweet, smooth and pink'], 20000),

  // ---------- Bebidas (carta real)
  M(52, 'bebidas', '1509042239860-f550ce710b93', ['Café pequeño', 'Small coffee'], ['Tinto o con leche', 'Black or with milk'], 3000),
  M(53, 'bebidas', '1600271886742-f049cd451bba', ['Jugos naturales', 'Fresh juices'], ['Mora, fresa, maracuyá, lulo, tomate, corozo, mango, tamarindo, guanábana o naranja', 'Blackberry, strawberry, passion fruit, lulo, tree tomato, corozo, mango, tamarind, soursop or orange'], 15000, 'c'),
  M(54, 'bebidas', '1600271886742-f049cd451bba', ['Jugos combinados', 'Mixed juices'], ['Fresa-cereza, fresa-guanábana, maracumango, cereza-mandarina o maracuyá-hierbabuena', 'Strawberry-cherry, strawberry-soursop, passion-mango, cherry-tangerine or passion-mint'], 16000),
  M(55, 'bebidas', L.limonada, ['Limonada natural', 'Fresh lemonade'], ['Clásica y bien fría', 'Classic and ice cold'], 14000),
  M(56, 'bebidas', L.limonada, ['Limonada suiza', 'Swiss lemonade'], ['Cremosa, con leche condensada', 'Creamy, with condensed milk'], 16000),
  M(57, 'bebidas', L.limonada, ['Limonada de hierbabuena', 'Mint lemonade'], ['Con hierbabuena fresca', 'With fresh mint'], 15000),
  M(58, 'bebidas', L.coctel, ['Limonada cerezada', 'Cherry lemonade'], ['Roja, verde o azul', 'Red, green or blue'], 16000),
  M(59, 'bebidas', '1600271886742-f049cd451bba', ['Mandarina', 'Tangerine'], ['Jugo de mandarina', 'Tangerine juice'], 16000),
  M(60, 'bebidas', '1556679343-c7306c1976bc', ['Bretaña panelada', 'Bretaña with panela'], ['Soda Bretaña con panela y limón', 'Bretaña soda with panela and lime'], 16000),
  M(61, 'bebidas', L.limonada, ['Limonada de coco', 'Coconut lemonade'], ['Cremosa y bien fría', 'Creamy and ice cold'], 17000, 'c'),
  M(62, 'bebidas', L.vino, ['Limonada de vino', 'Wine lemonade'], ['Limonada con vino tinto', 'Lemonade with red wine'], 18000),
  M(63, 'bebidas', '1554866585-cd94860890b7', ['Postobón 350 ml', 'Postobón 350 ml'], ['Gaseosa', 'Soda'], 6000),
  M(64, 'bebidas', '1554866585-cd94860890b7', ['Bretaña', 'Bretaña'], ['Soda', 'Club soda'], 6000),
  M(65, 'bebidas', '1554866585-cd94860890b7', ['Coca-Cola Zero 350', 'Coca-Cola Zero 350'], ['Gaseosa', 'Soda'], 7000),
  M(66, 'bebidas', '1556679343-c7306c1976bc', ['Té Hatsu', 'Hatsu tea'], ['Té frío', 'Iced tea'], 6000),
  M(67, 'bebidas', '1554866585-cd94860890b7', ['Gatorade', 'Gatorade'], ['Bebida hidratante', 'Sports drink'], 8000),
  M(68, 'bebidas', '1548839140-29a749e1cf4d', ['Botella de agua', 'Bottled water'], ['Agua', 'Water'], 5000),
  M(69, 'bebidas', '1535958636474-b021ee887b13', ['Cerveza Coronita', 'Coronita beer'], ['Bien fría', 'Ice cold'], 8000),
  M(70, 'bebidas', '1535958636474-b021ee887b13', ['Club Colombia', 'Club Colombia'], ['Cerveza', 'Beer'], 10000),
  M(71, 'bebidas', '1535958636474-b021ee887b13', ['Heineken', 'Heineken'], ['Cerveza', 'Beer'], 8000),
  M(72, 'bebidas', '1535958636474-b021ee887b13', ['Poker', 'Poker'], ['Cerveza', 'Beer'], 8000),
  M(73, 'bebidas', '1535958636474-b021ee887b13', ['Águila original', 'Águila original'], ['Cerveza', 'Beer'], 8000),
  M(74, 'bebidas', '1514362545857-3bc16c4c7d1b', ['Adición michelada', 'Michelada add-on'], ['Prepara tu cerveza como michelada', 'Turn your beer into a michelada'], 3000),
  M(75, 'bebidas', L.vino, ['Botella de vino', 'Bottle of wine'], ['Vino de la casa', 'House wine'], 70000),
];

// Los 3 platos para compartir (sección destacada)
export const SHARE_IDS = [7, 8, 17];

// Selector de salchipapa según personas
export const SIZES = [
  { id: 10, max: 1 }, { id: 11, max: 2 }, { id: 14, max: 3 }, { id: 15, max: 5 }, { id: 16, max: 8 }, { id: 17, max: 10 },
];

// Mosaico tipo Instagram
// Galería 3D (fotos reales de Quile). caption: [es, en]
export const GALLERY = [
  { src: L.espada, c: ['Espada Quile', 'Quile skewer'] },
  { src: L.coctel, c: ['Ocean Blue Margarita', 'Ocean Blue Margarita'] },
  { src: L.interior, c: ['Nuestro salón', 'Our dining room'] },
  { src: L.salchiquiloca, c: ['Salchiquiloca', 'Salchiquiloca'] },
  { src: L.limonada, c: ['Limonada Quile', 'Quile lemonade'] },
  { src: L.costillas, c: ['Al carbón', 'Charcoal grilled'] },
  { src: L.ambiente, c: ['El ambiente', 'The vibe'] },
  { src: L.fajita, c: ['Fajitas quileñas', 'Quile fajitas'] },
  { src: L.mazorcada, c: ['Mazorcada', 'Mazorcada'] },
  { src: L.pincho, c: ['Directo de la brasa', 'Straight from the grill'] },
  { src: L.nachos, c: ['Nachos Quile', 'Quile nachos'] },
  { src: L.parrillero, c: ['Servido en la mesa', 'Served at your table'] },
  { src: L.gratinada, c: ['Salchipapa gratinada', 'Gratinated salchipapa'] },
  { src: L.vino, c: ['Una copa de vino', 'A glass of wine'] },
  { src: L.carne, c: ['Punta de anca', 'Picanha'] },
];
