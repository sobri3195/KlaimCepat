import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Claims', href: '/claims', icon: FileText },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['MANAGER', 'FINANCE', 'CFO', 'ADMIN'] },
    { name: 'Budget', href: '/budget', icon: BarChart3 },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <AnimatePresence>
          {(sidebarOpen || mobileMenuOpen) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${
                sidebarOpen ? 'w-64' : 'w-20'
              } bg-gradient-to-b from-indigo-700 to-indigo-900 text-white fixed lg:relative h-screen z-50 shadow-2xl`}
            >
              <div className="p-4 flex items-center justify-between border-b border-indigo-600">
                {sidebarOpen && (
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-bold"
                  >
                    Expense Claims
                  </motion.h1>
                )}
                <button
                  onClick={() => {
                    setSidebarOpen(!sidebarOpen);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              <nav className="mt-8 px-2">
                {filteredNavigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-all ${
                        isActive(item.href)
                          ? 'bg-indigo-600 shadow-lg'
                          : 'hover:bg-indigo-600/50'
                      }`}
                    >
                      <item.icon size={20} />
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-10 bg-white rounded-r-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="absolute bottom-0 w-full p-4 border-t border-indigo-600">
                <div className="flex items-center justify-between">
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm flex-1"
                    >
                      <p className="font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-indigo-200 text-xs">{user?.role}</p>
                    </motion.div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-indigo-600 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm lg:hidden sticky top-0 z-40">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-bold text-gray-800">Expense Claims</h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
