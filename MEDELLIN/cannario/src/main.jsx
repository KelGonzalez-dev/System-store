import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n';

createRoot(document.getElementById('root')).render(<I18nProvider><App /></I18nProvider>);
