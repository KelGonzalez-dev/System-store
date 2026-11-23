import Bottle from './Bottle';

export default function ProductArt({ p, className = 'h-full w-full' }) {
  if (p.img) return <img src={p.img} alt={p.name} loading="lazy" decoding="async" className={`${className} object-contain`} draggable="false" />;
  return <Bottle shape={p.shape} liquid={p.liquid} className={className} />;
}
