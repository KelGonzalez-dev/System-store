import { thumb } from '../config';

/** Producto de la API → formato de la tienda (fotos sin repetir, miniatura para el carrito). */
export function adaptProduct(p) {
  const uniq = [...new Set([p.imagenUrl, ...(p.imagenes || []).map((x) => (typeof x === 'string' ? x : x?.url))].filter(Boolean))];
  return {
    id: p.id,
    codigo: p.codigo ?? null,
    name: p.nombre,
    desc: p.descripcion || '',
    details: p.descripcionLarga || p.descripcion || '',
    price: Number(p.precio),
    photos: uniq,
    image: uniq[0] ? thumb(uniq[0], 320) : '/images/emblema-192.webp',
  };
}

