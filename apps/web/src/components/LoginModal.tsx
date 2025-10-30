import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import api from '../services/api';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null);
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (isOpen && selectedRole) {
      handleAutoLogin(selectedRole);
    }
  }, [selectedRole, isOpen]);

  const handleAutoLogin = async (role: 'admin' | 'employee') => {
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
      toast.success(`Logged in as ${role}!`);
      onClose();
    } catch (error: any) {
      toast.error('Auto-login failed');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Expense Claims System
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-semibold text-center">
                🎭 Demo Mode
              </p>
              <p className="text-blue-600 text-xs text-center mt-1">
                Select a role to login with sample data
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
                <p className="text-gray-600 mt-2">Logging in...</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Demo features: 15 pre-loaded claims with various statuses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
