import { createRoot } from 'react-dom/client';
import './fonts';
import './index.css';
import App from './App';
import { QuoteProvider } from './quote';

createRoot(document.getElementById('root')).render(<QuoteProvider><App /></QuoteProvider>);
