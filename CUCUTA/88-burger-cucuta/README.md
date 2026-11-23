# 88 Burger · Cúcuta — sitio web

React 18 + Vite. Una sola página con loading propio, menú con pedidos por WhatsApp, animaciones 3D al hacer scroll y galería.

    npm install
    npm start        # http://localhost:3000
    npm run build    # genera build/ para subir al hosting

## Qué editar (todo en `src/data.js`)
| Qué | Dónde |
|---|---|
| ⚠️ **Número de WhatsApp** (en la captura se lee borroso: confirmar) | `CONFIG.whatsapp` |
| ⚠️ Dirección del local | `CONFIG.direccion` |
| ⚠️ Horario (se asumió 4:00 p. m. – 1:00 a. m. todos los días) | `HORARIO` |
| ⚠️ Formas de pago | `CONFIG.pagos` |
| ⚠️ **Menú y precios** (son de ejemplo/referencia) | `MENU`, `ADICIONES` |
| Fotos de la galería | `GALERIA` |

## Fotos
Las fotos actuales son de referencia (Unsplash). Para usar las reales del negocio, guárdalas en
`public/images/menu/` y en cada plato cambia `foto` por `'/images/menu/nombre.jpg'`.
Si una foto no carga, se muestra una ilustración del plato (nunca queda un hueco).

## Secciones
- **Loading "Avalancha de queso"** (`Loader.jsx`): la plancha sube a 188 °C, una cascada de queso cheddar
  gotea por la pantalla, el sello de 88 Burger se estampa y llueve tocineta; al final el queso se derrite hacia abajo.
- **Hero** (`Hero.jsx`): "No es una hamburguesa más." con la hamburguesa estrella en un plato con anillo giratorio.
- **Anatomía de una 88** (`Anatomia.jsx`): al hacer scroll la hamburguesa se separa capa por capa en el aire.
- **Menú** (`Menu.jsx`): categorías, plato estrella, tarjetas con inclinación 3D, ventana con adiciones y nota.
- **Pedido** (`Pedido.jsx`): carrito que se envía armado por WhatsApp (dirección, barrio, forma de pago, cambio).
- **Galería "Ensamble 3D"** (`Galeria.jsx`): las fotos llegan flotando desde el espacio y forman un mosaico.
- **Domicilios** (`Domicilio.jsx`): la moto recorre la carretera con el scroll, pasos para pedir, horario con "Abierto ahora".
