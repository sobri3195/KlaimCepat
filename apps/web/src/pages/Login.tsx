import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode && selectedRole) {
      handleDemoAutoLogin(selectedRole);
    }
  }, [selectedRole]);

  const handleDemoAutoLogin = async (role: 'admin' | 'employee') => {
    setLoading(true);
    const demoCredentials = {
      admin: { email: 'admin@company.com', password: 'Admin123!' },
      employee: { email: 'employee@company.com', password: 'Admin123!' },
    };

    const { email, password } = demoCredentials[role];
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success(`Auto-logged in as ${role}! (Demo Mode)`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Demo auto-login failed');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Expense Claims System
        </h2>

        {isDemoMode ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-semibold text-center">
                🎭 Demo Mode Active
              </p>
              <p className="text-blue-600 text-xs text-center mt-1">
                Select a role to auto-login with 15 dummy claims
              </p>
            </div>

            <button
              onClick={() => setSelectedRole('admin')}
              disabled={loading}
              className="w-full flex items-center justify-between py-3 px-4 border-2 border-indigo-600 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition disabled:opacity-50"
            >
              <span className="text-2xl">👨‍💼</span>
              <span className="flex-1 text-center">Login as Admin</span>
              <span className="text-xs bg-indigo-100 px-2 py-1 rounded">Full Access</span>
            </button>

            <button
              onClick={() => setSelectedRole('employee')}
              disabled={loading}
              className="w-full flex items-center justify-between py-3 px-4 border-2 border-green-600 rounded-lg text-green-600 hover:bg-green-50 font-medium transition disabled:opacity-50"
            >
              <span className="text-2xl">👤</span>
              <span className="flex-1 text-center">Login as Employee</span>
              <span className="text-xs bg-green-100 px-2 py-1 rounded">Standard</span>
            </button>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-gray-600 mt-2">Auto-logging in...</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Demo features: 15 pre-loaded claims with various statuses
              </p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Demo credentials:</p>
              <p className="mt-2 font-mono text-xs">
                admin@company.com / Admin123!<br />
                employee@company.com / Admin123!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
