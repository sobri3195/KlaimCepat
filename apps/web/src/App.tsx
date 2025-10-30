import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import CreateClaim from './pages/CreateClaim';
import ClaimDetail from './pages/ClaimDetail';
import Approvals from './pages/Approvals';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import LoginModal from './components/LoginModal';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Toaster position="top-right" />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      {isAuthenticated ? (
        <Routes>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/claims/new" element={<CreateClaim />} />
            <Route path="/claims/:id" element={<ClaimDetail />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Expense Claims System</h1>
            <p className="text-lg">Please login to continue</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
