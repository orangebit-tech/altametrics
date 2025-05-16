// 👇 Mocks must go first
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../features/auth/LoginPage';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setToken } from '../../features/auth/authSlice';
import * as storeHooks from '../../store';
import api from '../../api/axios';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('LoginPage', () => {
  const mockDispatch = jest.fn();
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
    });

  beforeEach(() => {
    store = createTestStore();
    jest.spyOn(storeHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    mockNavigate.mockClear();
  });

  const renderLogin = () =>
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

  it('renders form inputs and button', () => {
    renderLogin();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await screen.findByText('Invalid email address');
    await screen.findByText('Password too short');
  });

  it('submits form, dispatches token, and navigates to /invoices', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { access_token: 'mock-token' },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'demo@inbox.com' },
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'demo@inbox.com',
        password: 'password123',
      });
      expect(mockDispatch).toHaveBeenCalledWith(setToken('mock-token'));
      expect(mockNavigate).toHaveBeenCalledWith('/invoices');
    });
  });
});
