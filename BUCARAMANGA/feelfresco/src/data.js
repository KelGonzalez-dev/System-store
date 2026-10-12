// ============================================================
// MENÚ, GALERÍA E IMÁGENES — edita aquí platos, precios e imágenes.
// Textos: [español, inglés, portugués, francés, alemán]
// Imágenes: id de Unsplash o ruta local '/images/...'.
// Los platos y precios son de EJEMPLO: reemplázalos por los reales.
// ============================================================

export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales (de su Instagram, baja resolución). Reemplázalas por los originales con el mismo nombre.
export const LOCAL = {
  burger: '/images/local/burger.jpg',
  casa: '/images/local/casa-rosa.jpg',
  letrero: '/images/local/letrero.jpg',
};

export const CATS = ['burgers', 'combos', 'fries', 'sweets', 'shakes', 'drinks'];
export const CAT_IMG = {
  burgers: LOCAL.burger, combos: '1571091718767-18b5b1457add', fries: '1573080496219-bb080dd4f877',
  sweets: '1551024601-bec78aea704b', shakes: '1572490122747-3968b75cc699', drinks: '1600271886742-f049cd451bba',
};

// f: c = favorita, v = vegetariana, s = picante
const M = (id, cat, img, n, d, p, f = '') => ({ id, cat, img, n, d, p, fav: f.includes('c'), veg: f.includes('v'), hot: f.includes('s') });
const S = (x) => [x, x, x, x, x];

export const MENU = [
  // ---------- Smash burgers
  M(1, 'burgers', LOCAL.burger, S('Feel Fresco'),
    ['Doble smash, doble cheddar, cebolla, pepinillos y salsa Fresca en pan brioche', 'Double smash, double cheddar, onion, pickles and Fresca sauce on a brioche bun', 'Smash duplo, cheddar duplo, cebola, picles e molho Fresca no pão brioche', 'Double smash, double cheddar, oignon, pickles et sauce Fresca, pain brioché', 'Doppelter Smash, doppelter Cheddar, Zwiebeln, Gewürzgurken und Fresca-Sauce im Brioche'], 27000, 'c'),
  M(2, 'burgers', '1568901346375-23c9450c58cd', S('Oklahoma'),
    ['Cebolla en hilos smasheada dentro de la carne, cheddar y mostaza', 'Thin-sliced onion smashed into the patty, cheddar and mustard', 'Cebola fatiada prensada na carne, cheddar e mostarda', 'Oignon émincé écrasé dans la viande, cheddar et moutarde', 'Fein geschnittene Zwiebeln in das Patty gepresst, Cheddar und Senf'], 26000, 'c'),
  M(3, 'burgers', '1553979459-d2229ba7433b', S('S.O.S'),
    ['Triple smash, tocineta crocante, jalapeños y mayo picante. Para emergencias', 'Triple smash, crispy bacon, jalapeños and spicy mayo. For emergencies', 'Smash triplo, bacon crocante, jalapeños e maionese picante. Para emergências', 'Triple smash, bacon croustillant, jalapeños et mayo épicée. Pour les urgences', 'Dreifacher Smash, knuspriger Bacon, Jalapeños und scharfe Mayo. Für Notfälle'], 33000, 'cs'),
  M(4, 'burgers', '1550547660-d9450f859349', S('Extra Extra'),
    ['Doble smash con queso extra, tocineta extra y salsa extra. Todo extra', 'Double smash with extra cheese, extra bacon and extra sauce. Everything extra', 'Smash duplo com queijo extra, bacon extra e molho extra. Tudo extra', 'Double smash, fromage, bacon et sauce en extra. Tout en extra', 'Doppelter Smash mit extra Käse, extra Bacon und extra Sauce. Alles extra'], 31000),
  M(5, 'burgers', '1586190848861-99aa4a171e90', S('Don’t Stress'),
    ['La clásica sencilla: un smash, cheddar, tomate, lechuga y salsa de la casa', 'The simple classic: one smash, cheddar, tomato, lettuce and house sauce', 'A clássica simples: um smash, cheddar, tomate, alface e molho da casa', 'La classique : un smash, cheddar, tomate, salade et sauce maison', 'Der einfache Klassiker: ein Smash, Cheddar, Tomate, Salat und Haussauce'], 21000),
  M(6, 'burgers', '1606755962773-d324e0a13086', S('Crispy Fresco'),
    ['Pollo crocante, coleslaw rosado, pepinillos y miel picante', 'Crispy chicken, pink coleslaw, pickles and hot honey', 'Frango crocante, coleslaw rosa, picles e mel picante', 'Poulet croustillant, coleslaw rose, pickles et miel épicé', 'Knuspriges Hähnchen, rosa Krautsalat, Gewürzgurken und scharfer Honig'], 25000, 's'),
  M(7, 'burgers', '1520072959219-c595dc870360', S('Green Fresco'),
    ['Medallón de garbanzo smasheado, queso, aguacate y salsa de cilantro', 'Smashed chickpea patty, cheese, avocado and cilantro sauce', 'Hambúrguer de grão-de-bico prensado, queijo, abacate e molho de coentro', 'Galette de pois chiches écrasée, fromage, avocat et sauce coriandre', 'Gepresstes Kichererbsen-Patty, Käse, Avocado und Koriandersauce'], 23000, 'v'),

  // ---------- Combos
  M(8, 'combos', '1571091718767-18b5b1457add', ['Combo Fresco', 'Fresco combo', 'Combo Fresco', 'Menu Fresco', 'Fresco-Menü'],
    ['Tu smash favorita, papas y bebida', 'Your favorite smash, fries and a drink', 'Seu smash favorito, batata e bebida', 'Votre smash préféré, frites et boisson', 'Dein Lieblings-Smash, Pommes und ein Getränk'], 34000, 'c'),
  M(9, 'combos', '1550547660-d9450f859349', ['Combo pareja', 'Couple combo', 'Combo casal', 'Menu duo', 'Pärchen-Menü'],
    ['Dos smash burgers, papas grandes, dos bebidas y churros para compartir', 'Two smash burgers, large fries, two drinks and churros to share', 'Dois smash burgers, batata grande, duas bebidas e churros para dividir', 'Deux smash burgers, grandes frites, deux boissons et churros à partager', 'Zwei Smash Burger, große Pommes, zwei Getränke und Churros zum Teilen'], 69000),

  // ---------- Papas
  M(10, 'fries', '1573080496219-bb080dd4f877', ['Papas fritas', 'French fries', 'Batata frita', 'Frites', 'Pommes'],
    ['Crocantes, con sal y salsas de la casa', 'Crispy, salted, with house sauces', 'Crocantes, com sal e molhos da casa', 'Croustillantes, salées, sauces maison', 'Knusprig, gesalzen, mit Haussaucen'], 9000, 'v'),
  M(11, 'fries', '1541592106381-b31e9677c0e5', S('Papas Fresco'),
    ['Cheddar fundido, tocineta, cebollín y salsa Fresca', 'Melted cheddar, bacon, chives and Fresca sauce', 'Cheddar derretido, bacon, cebolinha e molho Fresca', 'Cheddar fondu, bacon, ciboulette et sauce Fresca', 'Geschmolzener Cheddar, Bacon, Schnittlauch und Fresca-Sauce'], 16000, 'c'),
  M(12, 'fries', '1573080496219-bb080dd4f877', ['Papas picantes', 'Spicy fries', 'Batata picante', 'Frites épicées', 'Scharfe Pommes'],
    ['Con paprika ahumada, jalapeño y mayo picante', 'With smoked paprika, jalapeño and spicy mayo', 'Com páprica defumada, jalapeño e maionese picante', 'Paprika fumé, jalapeño et mayo épicée', 'Mit Rauchpaprika, Jalapeño und scharfer Mayo'], 13000, 'sv'),

  // ---------- Churros y postres
  M(13, 'sweets', '1551024601-bec78aea704b', ['Churros con dips', 'Churros with dips', 'Churros com dips', 'Churros et sauces', 'Churros mit Dips'],
    ['Azúcar y canela, con arequipe y chocolate para mojar. Para compartir lo cotidiano', 'Cinnamon sugar, with dulce de leche and chocolate to dip. Made for sharing', 'Açúcar e canela, com doce de leite e chocolate. Para dividir', 'Sucre et cannelle, dulce de leche et chocolat à tremper. À partager', 'Zimtzucker, mit Dulce de Leche und Schokolade zum Dippen. Zum Teilen'], 14000, 'cv'),
  M(14, 'sweets', '1578985545062-69928b1d9587', ['Brownie con helado', 'Brownie with ice cream', 'Brownie com sorvete', 'Brownie et glace', 'Brownie mit Eis'],
    ['Brownie tibio con helado de vainilla', 'Warm brownie with vanilla ice cream', 'Brownie quente com sorvete de baunilha', 'Brownie tiède et glace vanille', 'Warmer Brownie mit Vanilleeis'], 13000, 'v'),

  // ---------- Malteadas
  M(15, 'shakes', '1572490122747-3968b75cc699', ['Malteada Pink', 'Pink shake', 'Milk-shake Pink', 'Milk-shake Pink', 'Pink Shake'],
    ['Fresa, helado de vainilla y chispas de colores', 'Strawberry, vanilla ice cream and sprinkles', 'Morango, sorvete de baunilha e confeitos', 'Fraise, glace vanille et vermicelles', 'Erdbeere, Vanilleeis und bunte Streusel'], 15000, 'cv'),
  M(16, 'shakes', '1572490122747-3968b75cc699', ['Malteada de Oreo', 'Oreo shake', 'Milk-shake de Oreo', 'Milk-shake Oreo', 'Oreo-Shake'],
    ['Helado de vainilla y galletas Oreo', 'Vanilla ice cream and Oreo cookies', 'Sorvete de baunilha e Oreo', 'Glace vanille et Oreo', 'Vanilleeis und Oreo-Kekse'], 15000, 'v'),
  M(17, 'shakes', '1572490122747-3968b75cc699', ['Malteada de arequipe', 'Dulce de leche shake', 'Milk-shake de doce de leite', 'Milk-shake dulce de leche', 'Dulce-de-Leche-Shake'],
    ['Helado, arequipe y galleta crocante', 'Ice cream, dulce de leche and cookie crumble', 'Sorvete, doce de leite e biscoito', 'Glace, dulce de leche et biscuit', 'Eis, Dulce de Leche und Keksbrösel'], 15000, 'v'),

  // ---------- Bebidas
  M(18, 'drinks', '1600271886742-f049cd451bba', ['Limonada rosada', 'Pink lemonade', 'Limonada rosa', 'Limonade rose', 'Pinke Limonade'],
    ['Limón, frutos rojos y hierbabuena', 'Lemon, red berries and mint', 'Limão, frutas vermelhas e hortelã', 'Citron, fruits rouges et menthe', 'Zitrone, rote Beeren und Minze'], 9000, 'c'),
  M(19, 'drinks', '1600271886742-f049cd451bba', ['Limonada de coco', 'Coconut lemonade', 'Limonada de coco', 'Citronnade coco', 'Kokos-Limonade'],
    ['Cremosa y bien fría', 'Creamy and ice cold', 'Cremosa e bem gelada', 'Onctueuse et bien fraîche', 'Cremig und eiskalt'], 10000),
  M(20, 'drinks', '1556679343-c7306c1976bc', ['Gaseosa', 'Soda', 'Refrigerante', 'Soda', 'Limo'],
    ['Pregunta por los sabores disponibles', 'Ask about available flavors', 'Pergunte pelos sabores', 'Demandez les parfums disponibles', 'Frag nach den Sorten'], 5000),
];

export const PICKS = [1, 2, 3, 11, 13, 15];

// Galería (pared de polaroids)
export const GALLERY = [
  LOCAL.casa, LOCAL.burger, LOCAL.letrero, '1568901346375-23c9450c58cd', '1571091718767-18b5b1457add',
  '1572490122747-3968b75cc699', '1553979459-d2229ba7433b', '1573080496219-bb080dd4f877',
];

// Horario (hora de Colombia). 0 = domingo … 6 = sábado. Minutos desde medianoche.
// "A partir de las 6:00 p. m. hasta las 10:00 p. m. (11:00 p. m. fines de semana)" — confirma con el cliente qué días son "fin de semana".
export const HOURS = { 0: [1080, 1320], 1: [1080, 1320], 2: [1080, 1320], 3: [1080, 1320], 4: [1080, 1320], 5: [1080, 1380], 6: [1080, 1380] };
