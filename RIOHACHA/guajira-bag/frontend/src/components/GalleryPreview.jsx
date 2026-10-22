import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGaleria } from '../api';
import Img from './Img';

export default function GalleryPreview() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getGaleria(true)
      .then((data) => setImages(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setImages([]));
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="gpreview">
      <div className="wrap">
        <div className="gpreview__head">
          <div>
            <span className="eyebrow">Galería</span>
            <h2 className="h-display">Momentos tejidos a mano</h2>
          </div>
          <Link to="/galeria" className="btn btn--line btn--sm">Ver toda la galería</Link>
        </div>
        <div className="gpreview__grid">
          {images.map((img) => (
            <div key={img.id} className="gpreview__item">
              <Img src={img.url} alt={img.caption || ''} w={640} widths={[480, 640, 960]} sizes="(max-width: 700px) 50vw, 300px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
