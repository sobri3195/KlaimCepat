import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  LogOut,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Claims', href: '/claims', icon: FileText },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['MANAGER', 'FINANCE', 'CFO', 'ADMIN'] },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300`}>
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">Expense Claims</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-indigo-600 rounded">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="mt-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 hover:bg-indigo-600 transition-colors"
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-indigo-600">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="text-sm">
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-indigo-200 text-xs">{user?.role}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-indigo-600 rounded"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
