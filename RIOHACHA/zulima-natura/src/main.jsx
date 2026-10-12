import { createRoot } from 'react-dom/client';
import './fonts';
import './index.css';
import App from './App';
import { BagProvider } from './bag';

createRoot(document.getElementById('root')).render(<BagProvider><App /></BagProvider>);
