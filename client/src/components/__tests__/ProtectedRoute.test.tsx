import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice'; // adjust path as needed

type RootState = {
  auth: {
    token: string | null;
  };
};

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  const renderWithStore = (preloadedState: RootState) => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    });

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders child component when token exists', () => {
    renderWithStore({ auth: { token: 'mock-token' } });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when token is missing', () => {
    renderWithStore({ auth: { token: null } });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
