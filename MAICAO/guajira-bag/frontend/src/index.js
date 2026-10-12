import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/loader.css';
import './styles/navbar.css';
import './styles/footer.css';
import './styles/misc.css';
import './styles/modal.css';
import './styles/cart.css';
import './styles/home.css';
import './styles/gallery.css';
import './styles/catalog.css';
import './styles/contact.css';
import './styles/admin.css';
import './styles/theme.css';

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
