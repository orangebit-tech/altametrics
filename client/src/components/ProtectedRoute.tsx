import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useSelector((state: any) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
