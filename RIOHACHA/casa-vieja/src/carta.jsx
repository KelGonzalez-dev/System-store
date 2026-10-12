import { createRoot } from 'react-dom/client';
import './fonts';
import './index.css';
import CartaPage from './components/CartaPage';
import { I18nProvider } from './i18n';

document.body.classList.add('ready', 'page-carta');
createRoot(document.getElementById('root')).render(<I18nProvider><CartaPage /></I18nProvider>);
