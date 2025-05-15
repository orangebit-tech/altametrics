import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { useAppDispatch } from '../store';
import Button from './Button';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <h3 className="p-4 py-6 font-bold text-gray-800 dark:text-gray-400">
        Dashboard
      </h3>

      <nav className="flex-1 px-4 space-y-2 text-sm">
        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded transition font-medium 
             ${
               isActive
                 ? 'bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-white'
                 : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
             }`
          }
        >
          <span className="text-lg">📄</span>
          <span>Invoices</span>
        </NavLink>
      </nav>

      <div className="p-4">
        <Button onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </aside>
  );
}
