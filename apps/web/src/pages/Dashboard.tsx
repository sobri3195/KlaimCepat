import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, Download, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { exportClaimsToPDF, exportClaimsToExcel } from '../utils/exportUtils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, claimsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/claims/my?limit=5'),
      ]);
      setStats(statsRes.data);
      setRecentClaims(claimsRes.data.claims);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-custom text-indigo-600 font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      exportClaimsToPDF(recentClaims, 'Recent Claims');
    } else {
      exportClaimsToExcel(recentClaims, 'recent_claims');
    }
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={20} className="mr-2" />
              Export
            </button>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg"
                >
                  Export as Excel
                </button>
              </motion.div>
            )}
          </div>
          <Link
            to="/claims/new"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} className="mr-2" />
            New Claim
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold">✨ AI OCR Now Available!</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Upload receipts and let AI automatically extract dates, amounts, vendors, and categories. Save time on data entry!
            </p>
            <Link
              to="/claims/new"
              className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold shadow-lg"
            >
              Try OCR Upload →
            </Link>
          </div>
          <div className="hidden lg:block text-6xl">📸</div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Claims"
          value={stats?.totalClaims || 0}
          icon={<FileText />}
          color="blue"
          delay={0.15}
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingApprovals || 0}
          icon={<Clock />}
          color="yellow"
          delay={0.25}
        />
        <StatCard
          title="Approved"
          value={stats?.claimsByStatus?.APPROVED || 0}
          icon={<CheckCircle />}
          color="green"
          delay={0.35}
        />
        <StatCard
          title="Total Amount"
          value={`Rp ${(stats?.totalAmount || 0).toLocaleString('id-ID')}`}
          icon={<TrendingUp />}
          color="purple"
          delay={0.45}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Claims</h2>
        
        {recentClaims.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No claims yet. Create your first claim!</p>
        ) : (
          <div className="space-y-3">
            {recentClaims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + index * 0.1 }}
              >
                <Link
                  to={`/claims/${claim.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold">{claim.title}</p>
                      <p className="text-sm text-gray-600">{claim.claimNumber}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">
                        {claim.currency} {claim.totalAmount.toLocaleString('id-ID')}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon, color, delay }: any) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-lg shadow-lg p-6 card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]} transition-transform hover:scale-110`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function getStatusColor(status: string) {
  const colors: any = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    PAID: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
