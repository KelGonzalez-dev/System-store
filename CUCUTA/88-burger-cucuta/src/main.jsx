import { createRoot } from 'react-dom/client';
import '@fontsource/bowlby-one/400.css';
import '@fontsource-variable/onest';
import './index.css';
import App from './App';
import { PedidoProvider } from './pedido';

createRoot(document.getElementById('root')).render(<PedidoProvider><App /></PedidoProvider>);
