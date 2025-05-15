import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { setToken } from './authSlice';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(3, { message: 'Password too short' }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      dispatch(setToken(res.data.access_token));
      navigate('/invoices');
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-4">Login to access your dashboard</p>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">Demo user: <strong>demo@inbox.com / password123</strong></p>
      </form>
    </div>
  );
}
