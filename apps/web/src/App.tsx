import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import CreateClaim from './pages/CreateClaim';
import ClaimDetail from './pages/ClaimDetail';
import Approvals from './pages/Approvals';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
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
    </>
  );
}

export default App;
