import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/login" />;
}
