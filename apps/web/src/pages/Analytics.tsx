import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [topSpenders, setTopSpenders] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, spendersRes, categoryRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/top-spenders?limit=5'),
        api.get('/analytics/category-breakdown'),
      ]);

      setStats(statsRes.data);
      setTopSpenders(spendersRes.data);
      setCategoryBreakdown(categoryRes.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Claims"
          value={stats?.totalClaims || 0}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Amount"
          value={`Rp ${(stats?.totalAmount || 0).toLocaleString('id-ID')}`}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Avg Approval Time"
          value={`${stats?.avgApprovalTime || 0}h`}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Claims by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.claimsByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="amount" fill="#4F46E5" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }: any) => `${category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalAmount"
                nameKey="category"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Spenders</h2>
          <div className="space-y-4">
            {topSpenders.map((spender, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{spender.user.name}</p>
                  <p className="text-sm text-gray-600">
                    {spender.claimCount} claims • Avg: Rp{' '}
                    {spender.avgClaimAmount.toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  Rp {spender.totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Claims by Status</h2>
          <div className="space-y-3">
            {Object.entries(stats?.claimsByStatus || {}).map(([status, count]: any) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-gray-700">{status.replace('_', ' ')}</span>
                <span className={`px-3 py-1 rounded font-semibold ${getStatusColor(status)}`}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Category Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryBreakdown.map((cat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{cat.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cat.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {cat.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {cat.avgAmount.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 text-sm">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
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
