import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <Link
          to="/claims/new"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} className="mr-2" />
          New Claim
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Claims"
          value={stats?.totalClaims || 0}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingApprovals || 0}
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats?.claimsByStatus?.APPROVED || 0}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="Total Amount"
          value={`Rp ${(stats?.totalAmount || 0).toLocaleString('id-ID')}`}
          icon={<FileText />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Claims</h2>
        
        {recentClaims.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No claims yet. Create your first claim!</p>
        ) : (
          <div className="space-y-4">
            {recentClaims.map((claim) => (
              <Link
                key={claim.id}
                to={`/claims/${claim.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{claim.title}</p>
                    <p className="text-sm text-gray-600">{claim.claimNumber}</p>
                  </div>
                  <div className="text-right">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>{icon}</div>
      </div>
    </div>
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
