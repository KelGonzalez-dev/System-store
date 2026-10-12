import { useCallback, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import CatalogPage from './pages/CatalogPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminGate from './admin/AdminGate';
import { useScrollTop } from './hooks/useScrollTop';
import { LoaderProvider, LOADS, useLoader } from './context/LoaderContext';
import { login } from './api';

function ScrollManager() {
  useScrollTop();
  return null;
}

function Shell() {
  const navigate = useNavigate();
  const run = useLoader();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('gb_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((product) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  // Botón "Panel administrativo": loader 5 s y luego login (o panel si ya hay sesión)
  const openAdmin = () => run(LOADS.admin, null, () => (user ? navigate('/admin') : setLoginOpen(true)));

  // Validar credenciales: loader "Validando credenciales" 3 s (el login corre en paralelo)
  const validate = (username, password) => new Promise((resolve) => {
    run(LOADS.login, () => login({ username, password }), (data, err) => {
      if (err || !data?.token) {
        resolve(err?.response?.data?.error || 'Credenciales incorrectas');
        return;
      }
      localStorage.setItem('gb_token', data.token);
      const u = { username: data.username, rol: data.rol };
      localStorage.setItem('gb_user', JSON.stringify(u));
      setUser(u);
      setLoginOpen(false);
      navigate('/admin');
      resolve(null);
    });
  });

  // Cerrar sesión: loader 5 s
  const handleLogout = () => run(LOADS.logout, null, () => {
    localStorage.removeItem('gb_token');
    localStorage.removeItem('gb_user');
    setUser(null);
    navigate('/');
  });

  return (
    <>
      <ScrollManager />
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} user={user} onAdmin={openAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalogPage onAdd={addToCart} />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/admin" element={<AdminGate user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer user={user} onAdmin={openAdmin} />
      <WhatsAppFab />
      <CartDrawer cart={cart} setCart={setCart} isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onValidate={validate} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <Shell />
      </LoaderProvider>
    </BrowserRouter>
  );
}
