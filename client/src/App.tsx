import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const InvoicesPage = lazy(() => import('./pages/InvoicePage'));

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          path="invoices"
          element={
            <Suspense fallback={<div className="text-center p-8">Loading Invoices...</div>}>
              <InvoicesPage />
            </Suspense>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
