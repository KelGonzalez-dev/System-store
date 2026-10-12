import React from 'react';
import { createRoot } from 'react-dom/client';
import EsalPage from './pages/EsalPage.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EsalPage />
  </React.StrictMode>
);
