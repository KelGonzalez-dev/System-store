import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================
// CONTACTO — completa PHONE con el WhatsApp del restaurante
// (solo números, con indicativo: '573001234567'). Si queda vacío,
// las reservas se envían por mensaje directo de Instagram.
// ============================================================
export const PHONE = '';
export const IG = 'lamarquesa_real';
export const LINKTREE = 'https://linktr.ee/marquesa_real';
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=The+Marquesa+Cra+50D+%2390-26+Aranjuez+Medell%C3%ADn';

export const LANGS = [
  { code: 'es', label: 'Español', locale: 'es-CO' },
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'pt', label: 'Português', locale: 'pt-BR' },
  { code: 'fr', label: 'Français', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch', locale: 'de-DE' },
];
const IDX = Object.fromEntries(LANGS.map((l, i) => [l.code, i]));

export const DICT = {
  es: {
    loader: { fire: 'Encendiendo la parrilla', skip: 'Entrar', switching: 'Cambiando idioma a' },
    nav: { vibe: 'Experiencia', menu: 'Carta', party: 'Celebraciones', gallery: 'Galería', visit: 'Visítanos', reserve: 'Reservar', open: 'Abrir menú', close: 'Cerrar menú', lang: 'Idioma' },
    hero: {
      eyebrow: 'Aranjuez · San Cayetano · Medellín', l1: 'Burgers', l2: '& chill', pre: 'Hoy se me antoja',
      words: ['una hamburguesa', 'unos tacos', 'papas cargadas', 'una buena carne', 'unas alitas', 'un cóctel con humo'],
      sub: 'Hamburguesas, tacos, papas, carnes y casi cualquier antojo que se te ocurra. Buena música, neón rosa y un ambiente para quedarse.',
      c1: 'Reservar mesa', c2: 'Ver la carta', openNow: 'Abierto ahora', closedNow: 'Hoy abrimos', closedToday: 'Hoy', tags: ['Burgers & Chill', 'Con amor'],
    },
    marquee: ['Hamburguesas', 'Tacos', 'Papas', 'Carnes', 'Alitas', 'Cócteles', 'Malteadas', 'Antojos'],
    vibe: {
      statement: 'Aquí no vienes a comer lo de siempre. Vienes a antojarte, a brindar con humo, a celebrar con globos y a quedarte un rato más.',
      cards: [
        { t: 'Una carta sin límites', d: 'De la hamburguesa doble a los tacos de birria, la picada para compartir o la pasta. Si se te antoja, lo hacemos.' },
        { t: 'Cócteles con humo', d: 'Coctelería de la casa servida con humo, frutos rojos y mucho rosa. Para la foto y para el brindis.' },
        { t: 'Un rincón para ti', d: 'Neón, música y mesas para la cita, el parche con amigos o la celebración de la semana.' },
      ],
    },
    menu: {
      title: 'La carta', lead: 'Hamburguesas, tacos, papas, carnes y mucho más. Elige una categoría y mira todos los platos con foto.',
      full: 'Ver la carta completa', back: 'Volver al inicio', picks: 'Favoritos de la casa', food: 'Comida', drinks: 'Bebidas',
      chef: 'Favorito', veg: 'Vegetariano', spicy: 'Picante', note: 'Precios de referencia en pesos colombianos. Pregunta por los platos del día.',
      off: { t: '¿Se te antoja algo que no está en la carta?', d: 'Escríbenos. La cocina de La Marquesa está abierta a casi cualquier antojo.', c: 'Escribir a la cocina' },
      cats: { burgers: 'Hamburguesas', tacos: 'Tacos', fries: 'Papas', grill: 'Carnes', wings: 'Alitas', starters: 'Entradas', cravings: 'Y lo que se te antoje', sweets: 'Postres', cocktails: 'Cócteles', shakes: 'Malteadas', zero: 'Sin alcohol', beer: 'Cervezas' },
    },
    party: {
      title: 'Te preparamos tu espacio', lead: 'Cumpleaños, aniversarios, sorpresas o simplemente porque sí. Llegas y tu mesa ya está lista.',
      points: ['Globos rosa y negro', 'Letrero de neón y bengalas', 'Pastel y brindis', 'Mesa decorada a tu gusto'], cta: 'Reservar mi celebración',
    },
    gal: { title: 'La galería', lead: 'Neón, globos, humo y mucha comida.', hint: 'Desliza para entrar', close: 'Cerrar' },
    visit: {
      title: 'Ven a La Marquesa', addr: 'Dirección', address: 'Cra 50D # 90-26, Aranjuez · San Cayetano, Medellín', map: 'Cómo llegar', hours: 'Horario',
      days: [['Lunes a jueves', '5:00 p. m. – 11:00 p. m.'], ['Viernes y sábado', '4:30 p. m. – 12:00 a. m.'], ['Domingo', '3:00 p. m. – 11:00 p. m.']],
      delivery: 'Domicilios', deliveryV: 'Pide desde nuestro Linktree', follow: 'Síguenos',
      formT: 'Reserva tu mesa', name: 'Nombre', namePh: 'Tu nombre', date: 'Fecha', time: 'Hora', people: 'Personas', occasion: 'Ocasión',
      occ: ['Comer y pasarla bien', 'Cumpleaños', 'Aniversario', 'Sorpresa', 'Plan con amigos'], one: 'persona', many: 'personas',
      send: 'Enviar por WhatsApp', sendIg: 'Enviar por Instagram', copied: 'Mensaje copiado. Pégalo en el chat de Instagram que se acaba de abrir.',
      msg: (n, d, h, p, o) => `Hola Marquesa, quiero reservar.\nNombre: ${n}\nFecha: ${d}\nHora: ${h}\nPersonas: ${p}\nOcasión: ${o}`,
    },
    foot: { rights: 'Todos los derechos reservados.', top: 'Volver arriba' },
  },
  en: {
    loader: { fire: 'Firing up the grill', skip: 'Enter', switching: 'Switching language to' },
    nav: { vibe: 'Experience', menu: 'Menu', party: 'Celebrations', gallery: 'Gallery', visit: 'Visit us', reserve: 'Book', open: 'Open menu', close: 'Close menu', lang: 'Language' },
    hero: {
      eyebrow: 'Aranjuez · San Cayetano · Medellín', l1: 'Burgers', l2: '& chill', pre: 'Tonight I’m craving',
      words: ['a burger', 'some tacos', 'loaded fries', 'a good steak', 'some wings', 'a smoky cocktail'],
      sub: 'Burgers, tacos, fries, grilled meats and almost any craving you can think of. Good music, pink neon and a place to stay a while.',
      c1: 'Book a table', c2: 'See the menu', openNow: 'Open now', closedNow: 'Today we open', closedToday: 'Today', tags: ['Burgers & Chill', 'With love'],
    },
    marquee: ['Burgers', 'Tacos', 'Fries', 'Grill', 'Wings', 'Cocktails', 'Shakes', 'Cravings'],
    vibe: {
      statement: 'You don’t come here for the usual. You come for cravings, smoky toasts, balloons for every celebration and one more round.',
      cards: [
        { t: 'A menu with no limits', d: 'From the double burger to birria tacos, a sharing platter or pasta. If you crave it, we make it.' },
        { t: 'Smoky cocktails', d: 'House cocktails served with smoke, red berries and plenty of pink. For the photo and for the toast.' },
        { t: 'A spot for you', d: 'Neon, music and tables for a date, a night with friends or this week’s celebration.' },
      ],
    },
    menu: {
      title: 'The menu', lead: 'Burgers, tacos, fries, grilled meats and much more. Pick a category and see every dish with a photo.',
      full: 'See the full menu', back: 'Back to home', picks: 'House favorites', food: 'Food', drinks: 'Drinks',
      chef: 'Favorite', veg: 'Vegetarian', spicy: 'Spicy', note: 'Reference prices in Colombian pesos. Ask about today’s specials.',
      off: { t: 'Craving something that isn’t on the menu?', d: 'Message us. The Marquesa kitchen is open to almost any craving.', c: 'Message the kitchen' },
      cats: { burgers: 'Burgers', tacos: 'Tacos', fries: 'Fries', grill: 'Grill', wings: 'Wings', starters: 'Starters', cravings: 'And whatever you crave', sweets: 'Desserts', cocktails: 'Cocktails', shakes: 'Shakes', zero: 'Alcohol-free', beer: 'Beer' },
    },
    party: {
      title: 'We set up your space', lead: 'Birthdays, anniversaries, surprises or just because. You arrive and your table is ready.',
      points: ['Pink and black balloons', 'Neon sign and sparklers', 'Cake and a toast', 'A table decorated your way'], cta: 'Book my celebration',
    },
    gal: { title: 'The gallery', lead: 'Neon, balloons, smoke and lots of food.', hint: 'Scroll to step inside', close: 'Close' },
    visit: {
      title: 'Come to La Marquesa', addr: 'Address', address: 'Cra 50D # 90-26, Aranjuez · San Cayetano, Medellín', map: 'Get directions', hours: 'Hours',
      days: [['Monday to Thursday', '5:00 pm – 11:00 pm'], ['Friday and Saturday', '4:30 pm – 12:00 am'], ['Sunday', '3:00 pm – 11:00 pm']],
      delivery: 'Delivery', deliveryV: 'Order from our Linktree', follow: 'Follow us',
      formT: 'Book your table', name: 'Name', namePh: 'Your name', date: 'Date', time: 'Time', people: 'Guests', occasion: 'Occasion',
      occ: ['Good food, good time', 'Birthday', 'Anniversary', 'Surprise', 'Night with friends'], one: 'guest', many: 'guests',
      send: 'Send via WhatsApp', sendIg: 'Send via Instagram', copied: 'Message copied. Paste it into the Instagram chat that just opened.',
      msg: (n, d, h, p, o) => `Hi Marquesa, I would like to book.\nName: ${n}\nDate: ${d}\nTime: ${h}\nGuests: ${p}\nOccasion: ${o}`,
    },
    foot: { rights: 'All rights reserved.', top: 'Back to top' },
  },
  pt: {
    loader: { fire: 'Acendendo a grelha', skip: 'Entrar', switching: 'Mudando o idioma para' },
    nav: { vibe: 'Experiência', menu: 'Cardápio', party: 'Celebrações', gallery: 'Galeria', visit: 'Visite-nos', reserve: 'Reservar', open: 'Abrir menu', close: 'Fechar menu', lang: 'Idioma' },
    hero: {
      eyebrow: 'Aranjuez · San Cayetano · Medellín', l1: 'Burgers', l2: '& chill', pre: 'Hoje eu quero',
      words: ['um hambúrguer', 'uns tacos', 'batata recheada', 'uma boa carne', 'umas asinhas', 'um drink com fumaça'],
      sub: 'Hambúrgueres, tacos, batatas, carnes e quase qualquer desejo que você imaginar. Boa música, neon rosa e um clima para ficar.',
      c1: 'Reservar mesa', c2: 'Ver o cardápio', openNow: 'Aberto agora', closedNow: 'Hoje abrimos', closedToday: 'Hoje', tags: ['Burgers & Chill', 'Com amor'],
    },
    marquee: ['Hambúrgueres', 'Tacos', 'Batatas', 'Carnes', 'Asinhas', 'Drinks', 'Milk-shakes', 'Desejos'],
    vibe: {
      statement: 'Aqui você não vem comer o de sempre. Vem matar a vontade, brindar com fumaça, celebrar com balões e ficar mais um pouco.',
      cards: [
        { t: 'Um cardápio sem limites', d: 'Do hambúrguer duplo aos tacos de birria, a tábua para compartilhar ou a massa. Se der vontade, a gente faz.' },
        { t: 'Drinks com fumaça', d: 'Coquetéis da casa servidos com fumaça, frutas vermelhas e muito rosa. Para a foto e para o brinde.' },
        { t: 'Um cantinho para você', d: 'Neon, música e mesas para o encontro, a turma de amigos ou a comemoração da semana.' },
      ],
    },
    menu: {
      title: 'O cardápio', lead: 'Hambúrgueres, tacos, batatas, carnes e muito mais. Escolha uma categoria e veja todos os pratos com foto.',
      full: 'Ver o cardápio completo', back: 'Voltar ao início', picks: 'Favoritos da casa', food: 'Comida', drinks: 'Bebidas',
      chef: 'Favorito', veg: 'Vegetariano', spicy: 'Picante', note: 'Preços de referência em pesos colombianos. Pergunte pelos pratos do dia.',
      off: { t: 'Quer algo que não está no cardápio?', d: 'Fale com a gente. A cozinha da Marquesa está aberta a quase qualquer desejo.', c: 'Falar com a cozinha' },
      cats: { burgers: 'Hambúrgueres', tacos: 'Tacos', fries: 'Batatas', grill: 'Carnes', wings: 'Asinhas', starters: 'Entradas', cravings: 'E o que der vontade', sweets: 'Sobremesas', cocktails: 'Drinks', shakes: 'Milk-shakes', zero: 'Sem álcool', beer: 'Cervejas' },
    },
    party: {
      title: 'Preparamos o seu espaço', lead: 'Aniversários, datas especiais, surpresas ou só porque sim. Você chega e a mesa já está pronta.',
      points: ['Balões rosa e preto', 'Letreiro neon e velas faísca', 'Bolo e brinde', 'Mesa decorada do seu jeito'], cta: 'Reservar minha comemoração',
    },
    gal: { title: 'A galeria', lead: 'Neon, balões, fumaça e muita comida.', hint: 'Deslize para entrar', close: 'Fechar' },
    visit: {
      title: 'Venha para a Marquesa', addr: 'Endereço', address: 'Cra 50D # 90-26, Aranjuez · San Cayetano, Medellín', map: 'Como chegar', hours: 'Horário',
      days: [['Segunda a quinta', '17h – 23h'], ['Sexta e sábado', '16h30 – 0h'], ['Domingo', '15h – 23h']],
      delivery: 'Delivery', deliveryV: 'Peça pelo nosso Linktree', follow: 'Siga a gente',
      formT: 'Reserve sua mesa', name: 'Nome', namePh: 'Seu nome', date: 'Data', time: 'Hora', people: 'Pessoas', occasion: 'Ocasião',
      occ: ['Comer bem e curtir', 'Aniversário', 'Data especial', 'Surpresa', 'Rolê com amigos'], one: 'pessoa', many: 'pessoas',
      send: 'Enviar pelo WhatsApp', sendIg: 'Enviar pelo Instagram', copied: 'Mensagem copiada. Cole no chat do Instagram que acabou de abrir.',
      msg: (n, d, h, p, o) => `Olá Marquesa, quero reservar.\nNome: ${n}\nData: ${d}\nHora: ${h}\nPessoas: ${p}\nOcasião: ${o}`,
    },
    foot: { rights: 'Todos os direitos reservados.', top: 'Voltar ao topo' },
  },
  fr: {
    loader: { fire: 'On allume le grill', skip: 'Entrer', switching: 'Changement de langue :' },
    nav: { vibe: 'Expérience', menu: 'Carte', party: 'Fêtes', gallery: 'Galerie', visit: 'Venir', reserve: 'Réserver', open: 'Ouvrir le menu', close: 'Fermer le menu', lang: 'Langue' },
    hero: {
      eyebrow: 'Aranjuez · San Cayetano · Medellín', l1: 'Burgers', l2: '& chill', pre: 'Ce soir, j’ai envie',
      words: ['d’un burger', 'de tacos', 'de frites garnies', 'd’une belle viande', 'd’ailes de poulet', 'd’un cocktail fumé'],
      sub: 'Burgers, tacos, frites, grillades et presque toutes les envies possibles. Bonne musique, néon rose et une ambiance où l’on reste.',
      c1: 'Réserver une table', c2: 'Voir la carte', openNow: 'Ouvert', closedNow: 'Ouverture aujourd’hui', closedToday: 'Aujourd’hui', tags: ['Burgers & Chill', 'Avec amour'],
    },
    marquee: ['Burgers', 'Tacos', 'Frites', 'Grillades', 'Ailes', 'Cocktails', 'Milk-shakes', 'Envies'],
    vibe: {
      statement: 'Ici, on ne vient pas manger comme d’habitude. On vient pour ses envies, trinquer dans la fumée, fêter avec des ballons et rester encore un peu.',
      cards: [
        { t: 'Une carte sans limites', d: 'Du double burger aux tacos de birria, la planche à partager ou les pâtes. Si vous en avez envie, on le fait.' },
        { t: 'Cocktails fumés', d: 'Cocktails maison servis dans la fumée, fruits rouges et beaucoup de rose. Pour la photo et pour trinquer.' },
        { t: 'Un coin pour vous', d: 'Néon, musique et tables pour un rendez-vous, une soirée entre amis ou la fête de la semaine.' },
      ],
    },
    menu: {
      title: 'La carte', lead: 'Burgers, tacos, frites, grillades et bien plus. Choisissez une catégorie et découvrez chaque plat en photo.',
      full: 'Voir la carte complète', back: 'Retour à l’accueil', picks: 'Les favoris de la maison', food: 'À manger', drinks: 'À boire',
      chef: 'Favori', veg: 'Végétarien', spicy: 'Épicé', note: 'Prix indicatifs en pesos colombiens. Demandez les suggestions du jour.',
      off: { t: 'Envie de quelque chose qui n’est pas à la carte ?', d: 'Écrivez-nous. La cuisine de La Marquesa est ouverte à presque toutes les envies.', c: 'Écrire à la cuisine' },
      cats: { burgers: 'Burgers', tacos: 'Tacos', fries: 'Frites', grill: 'Grillades', wings: 'Ailes', starters: 'Entrées', cravings: 'Et toutes vos envies', sweets: 'Desserts', cocktails: 'Cocktails', shakes: 'Milk-shakes', zero: 'Sans alcool', beer: 'Bières' },
    },
    party: {
      title: 'Nous préparons votre espace', lead: 'Anniversaires, surprises ou simplement pour le plaisir. Vous arrivez, votre table est prête.',
      points: ['Ballons roses et noirs', 'Néon et cierges magiques', 'Gâteau et toast', 'Table décorée à votre goût'], cta: 'Réserver ma fête',
    },
    gal: { title: 'La galerie', lead: 'Néon, ballons, fumée et beaucoup à manger.', hint: 'Faites défiler pour entrer', close: 'Fermer' },
    visit: {
      title: 'Venez à La Marquesa', addr: 'Adresse', address: 'Cra 50D # 90-26, Aranjuez · San Cayetano, Medellín', map: 'Itinéraire', hours: 'Horaires',
      days: [['Du lundi au jeudi', '17 h – 23 h'], ['Vendredi et samedi', '16 h 30 – minuit'], ['Dimanche', '15 h – 23 h']],
      delivery: 'Livraison', deliveryV: 'Commandez via notre Linktree', follow: 'Suivez-nous',
      formT: 'Réservez votre table', name: 'Nom', namePh: 'Votre nom', date: 'Date', time: 'Heure', people: 'Personnes', occasion: 'Occasion',
      occ: ['Bien manger', 'Anniversaire', 'Anniversaire de couple', 'Surprise', 'Soirée entre amis'], one: 'personne', many: 'personnes',
      send: 'Envoyer via WhatsApp', sendIg: 'Envoyer via Instagram', copied: 'Message copié. Collez-le dans la conversation Instagram qui vient de s’ouvrir.',
      msg: (n, d, h, p, o) => `Bonjour Marquesa, je souhaite réserver.\nNom : ${n}\nDate : ${d}\nHeure : ${h}\nPersonnes : ${p}\nOccasion : ${o}`,
    },
    foot: { rights: 'Tous droits réservés.', top: 'Haut de page' },
  },
  de: {
    loader: { fire: 'Der Grill wird angeheizt', skip: 'Eintreten', switching: 'Sprache wird umgestellt auf' },
    nav: { vibe: 'Erlebnis', menu: 'Karte', party: 'Feiern', gallery: 'Galerie', visit: 'Anfahrt', reserve: 'Reservieren', open: 'Menü öffnen', close: 'Menü schließen', lang: 'Sprache' },
    hero: {
      eyebrow: 'Aranjuez · San Cayetano · Medellín', l1: 'Burgers', l2: '& chill', pre: 'Heute habe ich Lust auf',
      words: ['einen Burger', 'Tacos', 'beladene Pommes', 'ein gutes Steak', 'Chicken Wings', 'einen Rauch-Cocktail'],
      sub: 'Burger, Tacos, Pommes, Grillfleisch und fast alles, worauf du Lust hast. Gute Musik, pinkes Neon und eine Stimmung zum Bleiben.',
      c1: 'Tisch reservieren', c2: 'Zur Karte', openNow: 'Jetzt geöffnet', closedNow: 'Heute ab', closedToday: 'Heute', tags: ['Burgers & Chill', 'Mit Liebe'],
    },
    marquee: ['Burger', 'Tacos', 'Pommes', 'Grill', 'Wings', 'Cocktails', 'Shakes', 'Gelüste'],
    vibe: {
      statement: 'Hierher kommt man nicht für das Übliche. Man kommt für seine Gelüste, für Rauch im Glas, für Ballons zu jeder Feier und für noch eine Runde.',
      cards: [
        { t: 'Eine Karte ohne Grenzen', d: 'Vom doppelten Burger über Birria-Tacos bis zur Platte zum Teilen oder Pasta. Worauf du Lust hast, das machen wir.' },
        { t: 'Cocktails mit Rauch', d: 'Hauscocktails mit Rauch, roten Beeren und viel Pink serviert. Fürs Foto und zum Anstoßen.' },
        { t: 'Ein Platz für dich', d: 'Neon, Musik und Tische für das Date, den Abend mit Freunden oder die Feier der Woche.' },
      ],
    },
    menu: {
      title: 'Die Karte', lead: 'Burger, Tacos, Pommes, Grillfleisch und vieles mehr. Wähle eine Kategorie und sieh jedes Gericht mit Foto.',
      full: 'Ganze Karte ansehen', back: 'Zur Startseite', picks: 'Lieblinge des Hauses', food: 'Essen', drinks: 'Getränke',
      chef: 'Liebling', veg: 'Vegetarisch', spicy: 'Scharf', note: 'Richtpreise in kolumbianischen Pesos. Frag nach den Tagesgerichten.',
      off: { t: 'Lust auf etwas, das nicht auf der Karte steht?', d: 'Schreib uns. Die Küche der Marquesa ist offen für fast jeden Wunsch.', c: 'Der Küche schreiben' },
      cats: { burgers: 'Burger', tacos: 'Tacos', fries: 'Pommes', grill: 'Grill', wings: 'Wings', starters: 'Vorspeisen', cravings: 'Und worauf du Lust hast', sweets: 'Desserts', cocktails: 'Cocktails', shakes: 'Shakes', zero: 'Alkoholfrei', beer: 'Bier' },
    },
    party: {
      title: 'Wir bereiten deinen Platz vor', lead: 'Geburtstage, Jahrestage, Überraschungen oder einfach so. Du kommst an und dein Tisch ist fertig.',
      points: ['Ballons in Pink und Schwarz', 'Neonschild und Wunderkerzen', 'Torte und ein Toast', 'Ein Tisch nach deinem Geschmack'], cta: 'Meine Feier reservieren',
    },
    gal: { title: 'Die Galerie', lead: 'Neon, Ballons, Rauch und jede Menge Essen.', hint: 'Scrollen, um einzutreten', close: 'Schließen' },
    visit: {
      title: 'Komm in die Marquesa', addr: 'Adresse', address: 'Cra 50D # 90-26, Aranjuez · San Cayetano, Medellín', map: 'Route planen', hours: 'Öffnungszeiten',
      days: [['Montag bis Donnerstag', '17:00 – 23:00'], ['Freitag und Samstag', '16:30 – 24:00'], ['Sonntag', '15:00 – 23:00']],
      delivery: 'Lieferung', deliveryV: 'Bestellen über unseren Linktree', follow: 'Folge uns',
      formT: 'Tisch reservieren', name: 'Name', namePh: 'Dein Name', date: 'Datum', time: 'Uhrzeit', people: 'Personen', occasion: 'Anlass',
      occ: ['Gut essen', 'Geburtstag', 'Jahrestag', 'Überraschung', 'Abend mit Freunden'], one: 'Person', many: 'Personen',
      send: 'Per WhatsApp senden', sendIg: 'Per Instagram senden', copied: 'Nachricht kopiert. Füge sie im gerade geöffneten Instagram-Chat ein.',
      msg: (n, d, h, p, o) => `Hallo Marquesa, ich möchte reservieren.\nName: ${n}\nDatum: ${d}\nUhrzeit: ${h}\nPersonen: ${p}\nAnlass: ${o}`,
    },
    foot: { rights: 'Alle Rechte vorbehalten.', top: 'Nach oben' },
  },
};

const Ctx = createContext(null);
export const useI18n = () => useContext(Ctx);

function detect() {
  try { const s = localStorage.getItem('mq_lang'); if (s && DICT[s]) return s; } catch { /* sin almacenamiento */ }
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  return DICT[nav] ? nav : 'es';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  const [switching, setSwitching] = useState(null);
  const timers = useRef([]);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('mq_lang', lang); } catch { /* sin almacenamiento */ }
  }, [lang]);
  // Cambio de idioma con aviso de 2 s: el texto cambia detrás del velo
  const changeLang = useCallback((code) => {
    if (!DICT[code] || code === lang || switching) return;
    timers.current.forEach(clearTimeout);
    setSwitching(code);
    timers.current = [setTimeout(() => setLang(code), 900), setTimeout(() => setSwitching(null), 2000)];
  }, [lang, switching]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const pick = useCallback((arr) => (Array.isArray(arr) ? arr[IDX[lang]] ?? arr[1] ?? arr[0] : arr), [lang]);
  const value = useMemo(() => ({ lang, setLang: changeLang, switching, t: DICT[lang], pick, locale: LANGS[IDX[lang]].locale }), [lang, pick, changeLang, switching]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Abre la conversación para reservar o pedir algo: WhatsApp si hay número, si no, Instagram (copiando el mensaje)
export async function sendMessage(text) {
  if (PHONE) {
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    return 'wa';
  }
  try { await navigator.clipboard.writeText(text); } catch { /* el portapapeles puede no estar disponible */ }
  window.open(`https://ig.me/m/${IG}`, '_blank', 'noopener');
  return 'ig';
}
