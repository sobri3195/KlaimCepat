import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaim();
  }, [id]);

  const loadClaim = async () => {
    try {
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data);
    } catch (error) {
      toast.error('Failed to load claim');
      navigate('/claims');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/claims/${id}/submit`);
      toast.success('Claim submitted for approval!');
      loadClaim();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit claim');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!claim) {
    return <div className="text-center py-8">Claim not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/claims')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Claims
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{claim.title}</h1>
            <p className="text-gray-600">{claim.claimNumber}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(claim.status)}`}
          >
            {claim.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Employee</p>
            <p className="font-semibold">
              {claim.user.firstName} {claim.user.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-semibold text-xl">
              {claim.currency} {claim.totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="font-semibold">
              {claim.submittedAt
                ? new Date(claim.submittedAt).toLocaleDateString('id-ID')
                : 'Not submitted'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-semibold">{claim.claimType}</p>
          </div>
        </div>

        {claim.description && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Description</p>
            <p className="text-gray-900">{claim.description}</p>
          </div>
        )}

        {claim.hasViolations && claim.policyViolations.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Policy Violations</h3>
            <ul className="space-y-2">
              {claim.policyViolations.map((violation: any) => (
                <li key={violation.id} className="text-sm text-red-800">
                  <span className="font-semibold">{violation.type}:</span> {violation.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Claim Items</h2>
        <div className="space-y-4">
          {claim.items.map((item: any) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('id-ID')} • {item.category}
                    {item.vendor && ` • ${item.vendor}`}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {item.currency} {item.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {claim.approvals.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Approval History</h2>
          <div className="space-y-4">
            {claim.approvals.map((approval: any) => (
              <div key={approval.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {approval.status === 'APPROVED' ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : approval.status === 'REJECTED' ? (
                    <XCircle className="text-red-600" size={24} />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    Level {approval.level} - {approval.approver.firstName}{' '}
                    {approval.approver.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{approval.approver.email}</p>
                  {approval.comments && (
                    <p className="text-sm text-gray-600 mt-1">
                      Comments: {approval.comments}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded text-sm ${getApprovalStatusColor(approval.status)}`}>
                  {approval.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {claim.status === 'DRAFT' && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Submit for Approval
          </button>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: any = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    PAID: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getApprovalStatusColor(status: string) {
  const colors: any = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
