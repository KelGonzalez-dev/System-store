# Canta Corazón · Saloon Sentimental — sitio web (demo)

React 18 + Vite. Una sola página con loading propio, noches como cartas de lotería, carta de tragos
como carteles de "Se busca", despedidas de soltera, galería fotomatón y reservas.

    npm install
    npm start        # http://localhost:3000
    npm run build    # genera build/ para subir al hosting

## Qué editar (todo en `src/data.js`)
| Qué | Dónde |
|---|---|
| ⚠️ WhatsApp de reservas (con el número, la reserva llega escrita por WhatsApp) | `CONFIG.whatsapp` |
| ⚠️ Horario (se asumió miércoles a sábado desde las 7 p. m.) | `HORARIO` |
| ⚠️ Programación de las noches | `NOCHES` |
| ⚠️ Tragos y precios (la carta real está en `menupp.co/cantacorazon`) | `TRAGOS` |
| ⚠️ Paquete de despedidas | `DESPEDIDA` |
| Fotos de la galería y despedidas | `TIRAS`, `HERO_FOTO` |

Sin número de WhatsApp, el botón de reservar copia los datos y abre el chat de Instagram.

## Fotos y logo
Las fotos son las de su Instagram (`public/images/fotos/`), recortadas de capturas de pantalla y mejoradas en
resolución. Cuando el bar entregue las originales, basta con reemplazar cada archivo con el mismo nombre.
El cupido, el nombre y el lema son su logo real vectorizado (`src/lib/logoPath.js`).

## Secciones
- **Loading "El lazo del corazón"** (`Loader.jsx`): un lazo vaquero gira, dibuja un corazón con la cuerda,
  el cupido del logo lo atraviesa con su flecha y la página se abre por dentro de un corazón que crece.
- **Hero** (`Hero.jsx`): tocadiscos con el cupido en la etiqueta; gira más rápido al hacer scroll.
- **El saloon** (`Saloon.jsx`): frase que se colorea al aparecer.
- **Noches** (`Noches.jsx`): cartas de lotería que se voltean en 3D con el plan de cada noche.
- **La barra** (`Tragos.jsx`): carteles de "Se busca" con la recompensa como precio.
- **Despedidas** (`Despedidas.jsx`), **Galería fotomatón** (`Galeria.jsx`), **Reservas** con mapa (`Reserva.jsx`).
