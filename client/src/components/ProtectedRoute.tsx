import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type {ReactNode} from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useSelector((state: any) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
