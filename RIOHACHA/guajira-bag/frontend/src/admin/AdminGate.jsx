import { Navigate } from 'react-router-dom';
import AdminPanel from './AdminPanel';

export default function AdminGate({ user, onLogout }) {
  if (!user) return <Navigate to="/" replace />;
  return <AdminPanel user={user} onLogout={onLogout} />;
}
