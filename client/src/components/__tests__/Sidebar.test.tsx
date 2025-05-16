// 👇 Must be first
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import * as storeHooks from '../../store';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('Sidebar Component', () => {
  const mockDispatch = jest.fn();
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: { token: 'mock-token' },
      },
    });

  beforeEach(() => {
    store = createTestStore();
    jest.spyOn(storeHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    mockNavigate.mockClear();
  });

  const renderWithProviders = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </Provider>
    );

  it('renders the sidebar with dashboard and invoices', () => {
    renderWithProviders();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Invoices')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('dispatches logout and navigates to /login on logout button click', () => {
    renderWithProviders();
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
