// ============================================================
// CARTA, GALERÍA E IMÁGENES — edita aquí platos, precios e imágenes.
// Textos: [español, inglés, portugués, francés, alemán]
// Imágenes: id de Unsplash o ruta local '/images/...'.
// Los platos y precios son de EJEMPLO: reemplázalos por los reales.
// ============================================================

export const U = (id, w = 900) => (id.startsWith('/') || id.startsWith('http') ? id : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`);

// Fotos reales de The Marquesa (sacadas de su Instagram, baja resolución).
// Reemplaza los archivos en /public/images/local/ por los originales con el mismo nombre.
export const LOCAL = {
  logo: '/images/local/logo.png',
  burgerAlta: '/images/local/burger-alta.jpg',
  burgerSign: '/images/local/burger-sign.jpg',
  neonGlobos: '/images/local/neon-globos.jpg',
  neonAmor: '/images/local/neon-amor.jpg',
  dedos: '/images/local/dedos-queso.jpg',
  tacos: '/images/local/tacos.jpg',
  aerea: '/images/local/aerea.jpg',
  espacio: '/images/local/espacio.jpg',
  fondo: '/images/local/hero-fondo.jpg',
};

export const GROUPS = {
  food: ['burgers', 'tacos', 'fries', 'grill', 'wings', 'starters', 'cravings', 'sweets'],
  drinks: ['cocktails', 'shakes', 'zero', 'beer'],
};

// Foto de cada categoría (lista grande de la carta en el inicio)
export const CAT_IMG = {
  burgers: LOCAL.burgerAlta, tacos: LOCAL.tacos, fries: '1573080496219-bb080dd4f877', grill: '1544025162-d76694265947',
  wings: '1608039755401-742074f0548d', starters: LOCAL.dedos, cravings: '1565299624946-b28f40a0ae38', sweets: '1578985545062-69928b1d9587',
  cocktails: '1551024709-8f23befc6f87', shakes: '1572490122747-3968b75cc699', zero: '1600271886742-f049cd451bba', beer: '1535958636474-b021ee887b13',
};

// f: c = favorito de la casa, v = vegetariano, s = picante
const M = (id, cat, img, n, d, p, f = '') => ({ id, cat, img, n, d, p, chef: f.includes('c'), veg: f.includes('v'), spicy: f.includes('s') });
const S = (x) => [x, x, x, x, x];

export const MENU = [
  // ---------- Hamburguesas
  M(1, 'burgers', LOCAL.burgerAlta, S('La Marquesa'),
    ['Doble carne angus, cheddar fundido, tocineta crocante, cebolla caramelizada y salsa de la casa', 'Double angus beef, melted cheddar, crispy bacon, caramelized onion and house sauce', 'Carne angus dupla, cheddar derretido, bacon crocante, cebola caramelizada e molho da casa', 'Double bœuf angus, cheddar fondu, bacon croustillant, oignon caramélisé et sauce maison', 'Doppeltes Angus-Rind, geschmolzener Cheddar, knuspriger Bacon, karamellisierte Zwiebeln und Haussauce'], 36000, 'c'),
  M(2, 'burgers', LOCAL.burgerSign, S('Con Amor'),
    ['Carne angus, queso crema, mermelada de tocineta, rúgula y pan brioche', 'Angus beef, cream cheese, bacon jam, arugula and brioche bun', 'Carne angus, cream cheese, geleia de bacon, rúcula e pão brioche', 'Bœuf angus, fromage frais, confiture de bacon, roquette et pain brioché', 'Angus-Rind, Frischkäse, Bacon-Marmelade, Rucola und Brioche'], 34000, 'c'),
  M(3, 'burgers', '1553979459-d2229ba7433b', S('Royal Bacon'),
    ['Carne de 200 g, doble tocineta, queso americano, pepinillos y BBQ ahumada', '200 g patty, double bacon, American cheese, pickles and smoky BBQ', 'Carne de 200 g, bacon duplo, queijo americano, picles e barbecue defumado', 'Steak haché 200 g, double bacon, cheddar américain, pickles et BBQ fumé', '200-g-Patty, doppelter Bacon, Schmelzkäse, Gewürzgurken und rauchige BBQ'], 32000),
  M(4, 'burgers', '1550547660-d9450f859349', S('Crispy Chicken'),
    ['Pechuga apanada crocante, coleslaw, pepinillos y mayo picante', 'Crispy breaded chicken breast, coleslaw, pickles and spicy mayo', 'Peito empanado crocante, coleslaw, picles e maionese picante', 'Poulet pané croustillant, coleslaw, pickles et mayo épicée', 'Knuspriges Hähnchen, Krautsalat, Gewürzgurken und scharfe Mayo'], 29000, 's'),
  M(5, 'burgers', '1568901346375-23c9450c58cd', S('Veggie Garden'),
    ['Medallón de garbanzo y champiñones, queso costeño asado, aguacate y tomate', 'Chickpea and mushroom patty, grilled costeño cheese, avocado and tomato', 'Hambúrguer de grão-de-bico e cogumelos, queijo costeño grelhado, abacate e tomate', 'Galette pois chiches et champignons, fromage costeño grillé, avocat et tomate', 'Kichererbsen-Pilz-Patty, gegrillter Costeño-Käse, Avocado und Tomate'], 27000, 'v'),

  // ---------- Tacos
  M(6, 'tacos', LOCAL.tacos, ['Tacos de birria', 'Birria tacos', 'Tacos de birria', 'Tacos de birria', 'Birria-Tacos'],
    ['Res guisada lento, queso fundido y consomé para mojar (3 unidades)', 'Slow-braised beef, melted cheese and consommé for dipping (3 pieces)', 'Carne cozida lentamente, queijo derretido e consomê para molhar (3 unidades)', 'Bœuf mijoté, fromage fondu et consommé à tremper (3 pièces)', 'Langsam geschmortes Rind, geschmolzener Käse und Consommé zum Dippen (3 Stück)'], 32000, 'c'),
  M(7, 'tacos', '1551504734-5ee1c4a1479b', ['Tacos al pastor', 'Al pastor tacos', 'Tacos al pastor', 'Tacos al pastor', 'Tacos al Pastor'],
    ['Cerdo adobado, piña asada, cebolla y cilantro (3 unidades)', 'Marinated pork, grilled pineapple, onion and cilantro (3 pieces)', 'Porco marinado, abacaxi grelhado, cebola e coentro (3 unidades)', 'Porc mariné, ananas grillé, oignon et coriandre (3 pièces)', 'Mariniertes Schwein, gegrillte Ananas, Zwiebel und Koriander (3 Stück)'], 26000),
  M(8, 'tacos', '1565299585323-38d6b0865b47', ['Tacos de camarón', 'Shrimp tacos', 'Tacos de camarão', 'Tacos aux crevettes', 'Garnelen-Tacos'],
    ['Camarón crocante, repollo morado, mango y chipotle (3 unidades)', 'Crispy shrimp, red cabbage, mango and chipotle (3 pieces)', 'Camarão crocante, repolho roxo, manga e chipotle (3 unidades)', 'Crevettes croustillantes, chou rouge, mangue et chipotle (3 pièces)', 'Knusprige Garnelen, Rotkohl, Mango und Chipotle (3 Stück)'], 30000, 's'),
  M(9, 'tacos', '1565299585323-38d6b0865b47', ['Quesadilla de pollo', 'Chicken quesadilla', 'Quesadilla de frango', 'Quesadilla au poulet', 'Hähnchen-Quesadilla'],
    ['Tortilla de harina, pollo desmechado, mezcla de quesos y pico de gallo', 'Flour tortilla, shredded chicken, cheese blend and pico de gallo', 'Tortilha de trigo, frango desfiado, mix de queijos e pico de gallo', 'Tortilla de blé, poulet effiloché, mélange de fromages et pico de gallo', 'Weizentortilla, gezupftes Hähnchen, Käsemischung und Pico de Gallo'], 24000),

  // ---------- Papas
  M(10, 'fries', '1573080496219-bb080dd4f877', S('Papas Marquesa'),
    ['Papas a la francesa, cheddar fundido, tocineta y salsa rosada de la casa', 'French fries, melted cheddar, bacon and house pink sauce', 'Batata frita, cheddar derretido, bacon e molho rosé da casa', 'Frites, cheddar fondu, bacon et sauce rose maison', 'Pommes, geschmolzener Cheddar, Bacon und rosa Haussauce'], 22000, 'c'),
  M(11, 'fries', '1541592106381-b31e9677c0e5', ['Papas trufadas', 'Truffle fries', 'Batata trufada', 'Frites à la truffe', 'Trüffel-Pommes'],
    ['Aceite de trufa, parmesano y perejil', 'Truffle oil, parmesan and parsley', 'Azeite trufado, parmesão e salsinha', 'Huile de truffe, parmesan et persil', 'Trüffelöl, Parmesan und Petersilie'], 20000, 'v'),
  M(12, 'fries', '1573080496219-bb080dd4f877', ['Papas callejeras', 'Street fries', 'Batata de rua', 'Frites de rue', 'Street-Pommes'],
    ['Carne desmechada, guacamole, jalapeños y crema agria', 'Shredded beef, guacamole, jalapeños and sour cream', 'Carne desfiada, guacamole, jalapeños e creme azedo', 'Bœuf effiloché, guacamole, jalapeños et crème aigre', 'Gezupftes Rind, Guacamole, Jalapeños und Sauerrahm'], 26000, 's'),

  // ---------- Carnes
  M(13, 'grill', '1600891964092-4316c288032e', S('Churrasco 400 g'),
    ['Corte a la parrilla con chimichurri, papas y ensalada', 'Grilled cut with chimichurri, fries and salad', 'Corte grelhado com chimichurri, batatas e salada', 'Pièce grillée, chimichurri, frites et salade', 'Gegrilltes Stück mit Chimichurri, Pommes und Salat'], 48000),
  M(14, 'grill', '1544025162-d76694265947', ['Costillas BBQ', 'BBQ ribs', 'Costelinha BBQ', 'Travers BBQ', 'BBQ-Rippchen'],
    ['Costillas de cerdo glaseadas en BBQ ahumada, de cocción lenta', 'Pork ribs glazed in smoky BBQ, slow cooked', 'Costelinha de porco no barbecue defumado, cozimento lento', 'Travers de porc laqués au BBQ fumé, cuisson lente', 'Schweinerippchen in rauchiger BBQ glasiert, langsam gegart'], 45000, 'c'),
  M(15, 'grill', '1558030006-450675393462', ['Punta de anca', 'Picanha', 'Picanha', 'Picanha', 'Picanha'],
    ['Con chimichurri, papa criolla y arepa', 'With chimichurri, creole potatoes and arepa', 'Com chimichurri, batata crioula e arepa', 'Avec chimichurri, pommes de terre créoles et arepa', 'Mit Chimichurri, kreolischen Kartoffeln und Arepa'], 46000),
  M(16, 'grill', '1555939594-58d7cb561ad1', ['Picada para compartir', 'Sharing platter', 'Tábua para compartilhar', 'Planche à partager', 'Platte zum Teilen'],
    ['Res, cerdo, chorizo, chicharrón, papa criolla, arepitas y guacamole (2 a 3 personas)', 'Beef, pork, chorizo, pork crackling, creole potatoes, mini arepas and guacamole (2 to 3 people)', 'Carne, porco, linguiça, torresmo, batata crioula, arepinhas e guacamole (2 a 3 pessoas)', 'Bœuf, porc, chorizo, couenne croustillante, pommes de terre créoles, mini arepas et guacamole (2 à 3 pers.)', 'Rind, Schwein, Chorizo, Schweinekruste, kreolische Kartoffeln, Mini-Arepas und Guacamole (2 bis 3 Pers.)'], 79000, 'c'),

  // ---------- Alitas
  M(17, 'wings', '1608039755401-742074f0548d', ['Alitas BBQ', 'BBQ wings', 'Asinhas BBQ', 'Ailes BBQ', 'BBQ-Wings'],
    ['10 alitas glaseadas, apio y salsa de queso azul', '10 glazed wings, celery and blue cheese dip', '10 asinhas glaceadas, salsão e molho de queijo azul', '10 ailes laquées, céleri et sauce au bleu', '10 glasierte Wings, Sellerie und Blauschimmelkäse-Dip'], 32000),
  M(18, 'wings', '1527477396000-e27163b481c2', ['Alitas búfalo', 'Buffalo wings', 'Asinhas búfalo', 'Ailes Buffalo', 'Buffalo-Wings'],
    ['Picantes de verdad, con ranch de la casa', 'Seriously spicy, with house ranch', 'Picantes de verdade, com ranch da casa', 'Vraiment épicées, avec ranch maison', 'Richtig scharf, mit hausgemachtem Ranch'], 32000, 's'),
  M(19, 'wings', '1608039755401-742074f0548d', ['Alitas maracuyá y ají', 'Passion fruit chili wings', 'Asinhas maracujá e pimenta', 'Ailes passion et piment', 'Maracuja-Chili-Wings'],
    ['Glaseado dulce y picante de maracuyá con ají', 'Sweet and spicy passion fruit chili glaze', 'Glaceado agridoce de maracujá com pimenta', 'Laquage sucré-épicé passion et piment', 'Süß-scharfe Glasur aus Maracuja und Chili'], 33000, 'cs'),

  // ---------- Entradas
  M(20, 'starters', LOCAL.dedos, ['Dedos de queso', 'Mozzarella sticks', 'Palitos de queijo', 'Bâtonnets de mozzarella', 'Mozzarella-Sticks'],
    ['Mozzarella apanada con mermelada de frutos rojos', 'Breaded mozzarella with red berry jam', 'Muçarela empanada com geleia de frutas vermelhas', 'Mozzarella panée, confiture de fruits rouges', 'Panierter Mozzarella mit Beerenkonfitüre'], 19000, 'cv'),
  M(21, 'starters', '1513456852971-30c0b8199d4d', S('Nachos Marquesa'),
    ['Totopos, queso fundido, carne, guacamole, pico de gallo y jalapeños', 'Tortilla chips, melted cheese, beef, guacamole, pico de gallo and jalapeños', 'Nachos, queijo derretido, carne, guacamole, pico de gallo e jalapeños', 'Chips de tortilla, fromage fondu, bœuf, guacamole, pico de gallo et jalapeños', 'Tortillachips, geschmolzener Käse, Rind, Guacamole, Pico de Gallo und Jalapeños'], 28000, 's'),
  M(22, 'starters', '1541592106381-b31e9677c0e5', ['Aros de cebolla', 'Onion rings', 'Anéis de cebola', 'Rondelles d’oignon', 'Zwiebelringe'],
    ['Crocantes, con salsa BBQ y mayo de ajo', 'Crispy, with BBQ sauce and garlic mayo', 'Crocantes, com molho barbecue e maionese de alho', 'Croustillantes, sauce BBQ et mayo à l’ail', 'Knusprig, mit BBQ-Sauce und Knoblauch-Mayo'], 16000, 'v'),
  M(23, 'starters', '1527477396000-e27163b481c2', ['Bocados de pollo', 'Chicken bites', 'Iscas de frango', 'Bouchées de poulet', 'Hähnchen-Bites'],
    ['Pollo crocante con miel mostaza', 'Crispy chicken with honey mustard', 'Frango crocante com mostarda e mel', 'Poulet croustillant, sauce miel-moutarde', 'Knuspriges Hähnchen mit Honig-Senf'], 21000),

  // ---------- Y lo que se te antoje
  M(24, 'cravings', '1565299624946-b28f40a0ae38', ['Pizza pepperoni personal', 'Personal pepperoni pizza', 'Pizza pepperoni individual', 'Pizza pepperoni individuelle', 'Pepperoni-Pizza für eine Person'],
    ['Masa delgada, mozzarella y pepperoni', 'Thin crust, mozzarella and pepperoni', 'Massa fina, muçarela e pepperoni', 'Pâte fine, mozzarella et pepperoni', 'Dünner Boden, Mozzarella und Pepperoni'], 30000),
  M(25, 'cravings', '1563379926898-05f4575a45d8', ['Pasta Alfredo con pollo', 'Chicken Alfredo pasta', 'Massa Alfredo com frango', 'Pâtes Alfredo au poulet', 'Alfredo-Pasta mit Hähnchen'],
    ['Fettuccine en salsa cremosa de parmesano', 'Fettuccine in a creamy parmesan sauce', 'Fettuccine ao molho cremoso de parmesão', 'Fettuccine, sauce crémeuse au parmesan', 'Fettuccine in cremiger Parmesansauce'], 32000),
  M(26, 'cravings', '1546069901-ba9599a7e63c', ['Bowl de salmón', 'Salmon bowl', 'Bowl de salmão', 'Bowl au saumon', 'Lachs-Bowl'],
    ['Arroz, salmón, aguacate, mango, edamame y salsa ponzu', 'Rice, salmon, avocado, mango, edamame and ponzu', 'Arroz, salmão, abacate, manga, edamame e molho ponzu', 'Riz, saumon, avocat, mangue, edamame et ponzu', 'Reis, Lachs, Avocado, Mango, Edamame und Ponzu'], 38000),
  M(27, 'cravings', '1553979459-d2229ba7433b', ['Perro Marquesa', 'Marquesa hot dog', 'Cachorro-quente Marquesa', 'Hot-dog Marquesa', 'Marquesa-Hotdog'],
    ['Salchicha americana, queso fundido, tocineta, papitas ripio y salsas', 'American sausage, melted cheese, bacon, potato sticks and sauces', 'Salsicha americana, queijo derretido, bacon, batata palha e molhos', 'Saucisse américaine, fromage fondu, bacon, pommes paille et sauces', 'Amerikanische Wurst, geschmolzener Käse, Bacon, Kartoffelstroh und Saucen'], 22000),

  // ---------- Postres
  M(28, 'sweets', '1578985545062-69928b1d9587', ['Brownie con helado', 'Brownie with ice cream', 'Brownie com sorvete', 'Brownie et glace', 'Brownie mit Eis'],
    ['Brownie tibio, helado de vainilla y salsa de chocolate', 'Warm brownie, vanilla ice cream and chocolate sauce', 'Brownie quente, sorvete de baunilha e calda de chocolate', 'Brownie tiède, glace vanille et sauce chocolat', 'Warmer Brownie, Vanilleeis und Schokoladensauce'], 18000, 'cv'),
  M(29, 'sweets', '1533134242443-d4fd215305ad', ['Cheesecake de frutos rojos', 'Red berry cheesecake', 'Cheesecake de frutas vermelhas', 'Cheesecake aux fruits rouges', 'Beeren-Cheesecake'],
    ['Cremoso, con base de galleta', 'Creamy, with a cookie crust', 'Cremoso, com base de biscoito', 'Crémeux, sur une base biscuitée', 'Cremig, mit Keksboden'], 17000, 'v'),
  M(30, 'sweets', '1551024601-bec78aea704b', ['Churros con arequipe', 'Churros with dulce de leche', 'Churros com doce de leite', 'Churros au dulce de leche', 'Churros mit Dulce de Leche'],
    ['Azúcar y canela, con arequipe para mojar', 'Cinnamon sugar, with dulce de leche for dipping', 'Açúcar e canela, com doce de leite para molhar', 'Sucre et cannelle, dulce de leche à tremper', 'Zimtzucker, mit Dulce de Leche zum Dippen'], 15000, 'v'),

  // ---------- Cócteles
  M(31, 'cocktails', '1551024709-8f23befc6f87', S('Marquesa Rosé'),
    ['Ginebra, frutos rojos, limón y espuma de rosas', 'Gin, red berries, lemon and rose foam', 'Gin, frutas vermelhas, limão e espuma de rosas', 'Gin, fruits rouges, citron et écume de rose', 'Gin, rote Beeren, Zitrone und Rosenschaum'], 32000, 'c'),
  M(32, 'cocktails', '1536935338788-846bb9981813', S('Humo Rosa'),
    ['Ron, maracuyá y frutos rojos servido con humo', 'Rum, passion fruit and red berries served with smoke', 'Rum, maracujá e frutas vermelhas servido com fumaça', 'Rhum, passion et fruits rouges servi dans la fumée', 'Rum, Maracuja und rote Beeren, mit Rauch serviert'], 34000, 'c'),
  M(33, 'cocktails', '1556679343-c7306c1976bc', ['Margarita de mango biche', 'Green mango margarita', 'Margarita de manga verde', 'Margarita à la mangue verte', 'Grüne-Mango-Margarita'],
    ['Tequila, mango biche, limón y sal de ají', 'Tequila, green mango, lime and chili salt', 'Tequila, manga verde, limão e sal de pimenta', 'Tequila, mangue verte, citron vert et sel pimenté', 'Tequila, grüne Mango, Limette und Chilisalz'], 30000, 's'),
  M(34, 'cocktails', '1514362545857-3bc16c4c7d1b', S('Mojito'),
    ['Ron blanco, hierbabuena, limón y soda, clásico o de frutos rojos', 'White rum, mint, lime and soda, classic or red berry', 'Rum branco, hortelã, limão e soda, clássico ou de frutas vermelhas', 'Rhum blanc, menthe, citron vert et soda, classique ou fruits rouges', 'Weißer Rum, Minze, Limette und Soda, klassisch oder mit Beeren'], 26000),
  M(35, 'cocktails', '1470337458703-46ad1756a187', S('Piña colada'),
    ['Ron, coco y piña, cremosa y bien fría', 'Rum, coconut and pineapple, creamy and ice cold', 'Rum, coco e abacaxi, cremosa e gelada', 'Rhum, coco et ananas, onctueuse et glacée', 'Rum, Kokos und Ananas, cremig und eiskalt'], 27000),

  // ---------- Malteadas
  M(36, 'shakes', '1572490122747-3968b75cc699', ['Malteada de Oreo', 'Oreo shake', 'Milk-shake de Oreo', 'Milk-shake Oreo', 'Oreo-Shake'],
    ['Helado de vainilla, galletas Oreo y crema batida', 'Vanilla ice cream, Oreo cookies and whipped cream', 'Sorvete de baunilha, biscoito Oreo e chantilly', 'Glace vanille, biscuits Oreo et chantilly', 'Vanilleeis, Oreo-Kekse und Sahne'], 18000, 'cv'),
  M(37, 'shakes', '1572490122747-3968b75cc699', ['Malteada de fresa', 'Strawberry shake', 'Milk-shake de morango', 'Milk-shake fraise', 'Erdbeer-Shake'],
    ['Fresas, helado y crema batida', 'Strawberries, ice cream and whipped cream', 'Morangos, sorvete e chantilly', 'Fraises, glace et chantilly', 'Erdbeeren, Eis und Sahne'], 17000, 'v'),
  M(38, 'shakes', '1572490122747-3968b75cc699', ['Malteada de arequipe', 'Dulce de leche shake', 'Milk-shake de doce de leite', 'Milk-shake dulce de leche', 'Dulce-de-Leche-Shake'],
    ['Helado, arequipe y galleta crocante', 'Ice cream, dulce de leche and cookie crumble', 'Sorvete, doce de leite e biscoito crocante', 'Glace, dulce de leche et biscuit croquant', 'Eis, Dulce de Leche und Keksbrösel'], 18000, 'v'),

  // ---------- Sin alcohol
  M(39, 'zero', '1536935338788-846bb9981813', S('Mocktail Marquesa'),
    ['Pitaya, maracuyá, hierbabuena y soda, servido con humo', 'Dragon fruit, passion fruit, mint and soda, served with smoke', 'Pitaia, maracujá, hortelã e soda, servido com fumaça', 'Pitaya, passion, menthe et soda, servi dans la fumée', 'Drachenfrucht, Maracuja, Minze und Soda, mit Rauch serviert'], 16000, 'c'),
  M(40, 'zero', '1600271886742-f049cd451bba', ['Limonada de coco', 'Coconut lemonade', 'Limonada de coco', 'Citronnade coco', 'Kokos-Limonade'],
    ['Cremosa y bien fría', 'Creamy and ice cold', 'Cremosa e bem gelada', 'Onctueuse et bien fraîche', 'Cremig und eiskalt'], 12000),
  M(41, 'zero', '1556679343-c7306c1976bc', ['Soda de frutos rojos', 'Red berry soda', 'Soda de frutas vermelhas', 'Soda aux fruits rouges', 'Beeren-Soda'],
    ['Frutos rojos, limón y soda', 'Red berries, lemon and soda', 'Frutas vermelhas, limão e soda', 'Fruits rouges, citron et soda', 'Rote Beeren, Zitrone und Soda'], 12000),

  // ---------- Cervezas
  M(42, 'beer', '1535958636474-b021ee887b13', ['Cerveza nacional', 'Local beer', 'Cerveja nacional', 'Bière locale', 'Lokales Bier'],
    ['Club Colombia, Águila o Póker', 'Club Colombia, Águila or Póker', 'Club Colombia, Águila ou Póker', 'Club Colombia, Águila ou Póker', 'Club Colombia, Águila oder Póker'], 8000),
  M(43, 'beer', '1535958636474-b021ee887b13', S('Michelada'),
    ['Cerveza con limón, sal y salsas, clásica o de mango', 'Beer with lime, salt and sauces, classic or mango', 'Cerveja com limão, sal e molhos, clássica ou de manga', 'Bière, citron vert, sel et sauces, classique ou mangue', 'Bier mit Limette, Salz und Saucen, klassisch oder Mango'], 12000, 's'),
  M(44, 'beer', '1566633806327-68e152aaf26d', ['Cerveza artesanal', 'Craft beer', 'Cerveja artesanal', 'Bière artisanale', 'Craft-Bier'],
    ['Pregunta por las de temporada', 'Ask about seasonal taps', 'Pergunte pelas da estação', 'Demandez les bières de saison', 'Frag nach den saisonalen Sorten'], 14000),
];

// Favoritos en el inicio (ids de MENU)
export const PICKS = [1, 6, 10, 16, 20, 32];

// Galería (túnel 3D): fotos reales del local y fotos globales
export const GALLERY = [
  LOCAL.neonGlobos, LOCAL.burgerAlta, '1551024709-8f23befc6f87', LOCAL.neonAmor, LOCAL.tacos,
  '1568901346375-23c9450c58cd', LOCAL.espacio, LOCAL.dedos, '1536935338788-846bb9981813', LOCAL.burgerSign,
  '1544025162-d76694265947', LOCAL.aerea,
];

// Horario real (hora de Colombia). Días: 0 = domingo … 6 = sábado. Minutos desde la medianoche.
export const HOURS = { 0: [900, 1380], 1: [1020, 1380], 2: [1020, 1380], 3: [1020, 1380], 4: [1020, 1380], 5: [990, 1440], 6: [990, 1440] };
