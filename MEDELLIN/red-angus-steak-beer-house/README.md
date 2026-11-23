# Red Angus Steak & Beer House — sitio web (versión clásica)

Diseño sobrio y elegante: tipografía Caslon, carbón, crema, borgoña y filetes dorados.
Animaciones mínimas (solo aparición suave al hacer scroll).

    npm install
    npm start        # http://localhost:3000
    npm run build    # genera build/ para subir al hosting

## Qué editar (todo en `src/data.js`)
| Qué | Dónde |
|---|---|
| ⚠️ WhatsApp de reservas (con el número, la reserva llega escrita por WhatsApp) | `CONFIG.whatsapp` |
| ⚠️ Direcciones y horarios de Bogotá y Chía | `SEDES` |
| ⚠️ Cortes, carta y precios (son de referencia) | `CORTES`, `CARTA` |
| Fotos de la galería | `GALERIA` |

Sin número de WhatsApp, la reserva se copia y se abre su enlace `linktr.ee/Redangussteak`.

## Fotos y logo
Las fotos son las de su Instagram (`public/images/fotos/`), recortadas de capturas y mejoradas en resolución.
Cuando el restaurante entregue las originales, basta con reemplazar cada archivo con el mismo nombre.
El letrero es su logo real vectorizado (`src/lib/logoPath.js`).

## Secciones
Entrada sobria con el letrero · Portada · Pilares de la casa · Nuestra casa · Cortes · La carta (estilo carta
impresa) · La barra · Galería · Eventos privados · Reservaciones con las dos sedes · Pie de página.
