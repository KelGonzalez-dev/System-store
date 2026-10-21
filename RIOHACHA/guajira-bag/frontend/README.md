# Guajira Bags — frontend v3.1 (React + Vite)

    npm install
    npm start        # http://localhost:3000
    npm run build    # genera la carpeta build/ para subir al hosting

La URL de la API se toma de `.env` (`REACT_APP_API_URL=https://api.guajirabags.com`).

## Estructura
- `src/pages/` — Inicio, Catálogo (20 por página), Galería ("Hilo de fotos"), Contacto.
- `src/components/LoadingScreen.jsx` — loader "Remolino de pétalos" con el emblema (`public/images/emblema-*.webp`).
- `src/components/Reviews.jsx` — reseñas en la ficha · `Testimonials.jsx` — reseñas en el inicio.
- `src/components/Picks.jsx` — "Elegidas para ti": adelanto del catálogo en el inicio (4 piezas + "+N piezas te esperan").
- `src/components/GalleryPreview.jsx` — carrusel 3D de arcos en el inicio.
- `src/components/Benefits.jsx` — Tejidas a mano · Piezas únicas · Envíos a toda Colombia · Pedido por WhatsApp.
- `src/components/Img.jsx` — imagen optimizada (miniaturas WebP de la API con respaldo al original).
- `src/admin/` — panel (Productos, Galería y Reseñas).
- `src/config.js` — URL de la API y ayudas de imágenes (`thumb`, `srcSet`).
