import { logout } from '../features/auth/authSlice';
import { useAppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import Button from './Button';
import { LogOut } from 'lucide-react';


export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useDarkMode();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className=" mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & title */}
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-6 w-6" />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            Demo App
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {isDark ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Avatar */}
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="User Avatar"
            className="h-9 w-9 rounded-full border border-gray-300 dark:border-gray-600"
          />

          {/* Logout */}
          <Button onClick={handleLogout} className="flex items-center justify-center gap-2">
            <LogOut size={18} />
            </Button>
        </div>
      </div>
    </header>
  );
}
