import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGaleria } from '../api';
import { toMediaUrl } from '../config';
import { useReveal } from '../hooks/useReveal';

export default function GalleryPreview() {
  const [images, setImages] = useState([]);
  const headRef = useReveal({});

  useEffect(() => {
    getGaleria(true)
      .then((data) => setImages(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setImages([]));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="gpreview">
      <div className="wrap">
        <div ref={headRef} className="rv gpreview__head" data-v="up">
          <div>
            <span className="eyebrow">Galería</span>
            <h2 className="h-display">Momentos tejidos a mano</h2>
          </div>
          <Link to="/galeria" className="btn btn--line btn--sm">Ver toda la galería</Link>
        </div>
        <div className="gpreview__grid">
          {images.map((img) => (
            <div key={img.id} className="gpreview__item">
              <img src={toMediaUrl(img.url)} alt={img.caption || ''} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
