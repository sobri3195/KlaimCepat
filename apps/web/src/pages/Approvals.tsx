import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Approvals() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const response = await api.get('/approvals/pending');
      setClaims(response.data);
    } catch (error) {
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId: string, comments?: string) => {
    setActionLoading(true);
    try {
      await api.post(`/approvals/${claimId}/approve`, { comments });
      toast.success('Claim approved successfully!');
      setSelectedClaim(null);
      loadPendingApprovals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (claimId: string, comments: string) => {
    if (!comments.trim()) {
      toast.error('Comments are required for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/approvals/${claimId}/reject`, { comments });
      toast.success('Claim rejected');
      setSelectedClaim(null);
      loadPendingApprovals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject claim');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : claims.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No pending approvals</div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="font-semibold text-lg">{claim.title}</p>
                      {claim.hasViolations && (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                          Policy Violations
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{claim.claimNumber}</p>
                    <p className="text-sm text-gray-600">
                      Employee: {claim.user.firstName} {claim.user.lastName} (
                      {claim.user.employeeId})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xl">
                      {claim.currency} {claim.totalAmount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-600">{claim.items.length} items</p>
                  </div>
                </div>

                {claim.policyViolations.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      Policy Violations:
                    </p>
                    <ul className="text-sm text-red-800 space-y-1">
                      {claim.policyViolations.slice(0, 2).map((v: any) => (
                        <li key={v.id}>• {v.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Items:</p>
                  <div className="space-y-2">
                    {claim.items.map((item: any) => (
                      <div key={item.id} className="text-sm flex justify-between">
                        <span>
                          {item.description} ({item.category})
                        </span>
                        <span className="font-semibold">
                          {item.currency} {item.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Link
                    to={`/claims/${claim.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedClaim({ ...claim, action: 'reject' })}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedClaim({ ...claim, action: 'approve' })}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {selectedClaim.action === 'approve' ? 'Approve Claim' : 'Reject Claim'}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Claim: {selectedClaim.claimNumber}</p>
              <p className="text-sm text-gray-600">
                Amount: {selectedClaim.currency}{' '}
                {selectedClaim.totalAmount.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments {selectedClaim.action === 'reject' && '(Required)'}
              </label>
              <textarea
                id="approval-comments"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add your comments..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const comments = (
                    document.getElementById('approval-comments') as HTMLTextAreaElement
                  )?.value;
                  if (selectedClaim.action === 'approve') {
                    handleApprove(selectedClaim.id, comments);
                  } else {
                    handleReject(selectedClaim.id, comments);
                  }
                }}
                className={`px-4 py-2 text-white rounded-lg ${
                  selectedClaim.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Processing...'
                  : selectedClaim.action === 'approve'
                  ? 'Approve'
                  : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
