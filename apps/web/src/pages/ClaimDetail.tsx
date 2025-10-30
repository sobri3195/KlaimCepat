import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Download, Edit, Trash2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { exportClaimToDetailedPDF, exportClaimDetailToExcel } from '../utils/exportUtils';

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

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

  const handleDelete = async () => {
    try {
      await api.delete(`/claims/${id}`);
      toast.success('Claim deleted successfully!');
      navigate('/claims');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete claim');
    }
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      exportClaimToDetailedPDF(claim);
    } else {
      exportClaimDetailToExcel(claim);
    }
    setShowExportMenu(false);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      toast.success('Comment added successfully!');
      setComment('');
      setShowComments(false);
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

  if (!claim) {
    return <div className="text-center py-8">Claim not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => navigate('/claims')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Claims
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{claim.title}</h1>
            <p className="text-gray-600">{claim.claimNumber}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(claim.status)}`}
            >
              {claim.status}
            </span>
            {claim.status === 'DRAFT' && (
              <>
                <button
                  onClick={() => navigate(`/claims/${id}/edit`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add Comment"
            >
              <MessageSquare size={20} className="text-gray-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export"
              >
                <Download size={20} className="text-gray-600" />
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
          </div>
        </div>

        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-blue-50 rounded-lg"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your comment..."
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowComments(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Comment
              </button>
            </div>
          </motion.div>
        )}

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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
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
      </motion.div>

      {claim.approvals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
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
        </motion.div>
      )}

      {claim.status === 'DRAFT' && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit for Approval
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this claim? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
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
