import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import * as storeHooks from '../../store';
import useDarkMode from '../../hooks/useDarkMode';
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('../../hooks/useDarkMode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('Header Component', () => {
  const mockDispatch = jest.fn();
  const setIsDark = jest.fn();
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
    (useDarkMode as jest.Mock).mockReturnValue([false, setIsDark]);
    mockNavigate.mockClear();
  });

  const renderWithProviders = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders logo and title', () => {
    renderWithProviders();
    expect(screen.getByText('Demo App')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', () => {
    renderWithProviders();
    const toggle = screen.getByRole('button', { name: /light/i });
    fireEvent.click(toggle);
    expect(setIsDark).toHaveBeenCalledWith(true);
  });

  it('dispatches logout and navigates on button click', () => {
    renderWithProviders();
    const logoutButton = screen.getByLabelText('Logout');
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
