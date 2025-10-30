import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { exportClaimsToPDF, exportClaimsToExcel } from '../utils/exportUtils';

export default function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadClaims();
  }, [filter]);

  useEffect(() => {
    filterClaims();
  }, [claims, searchQuery]);

  const loadClaims = async () => {
    try {
      const params: any = {};
      if (filter !== 'ALL') {
        params.status = filter;
      }
      
      const response = await api.get('/claims/my', { params });
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClaims = () => {
    if (!searchQuery) {
      setFilteredClaims(claims);
      return;
    }

    const filtered = claims.filter(
      (claim) =>
        claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClaims(filtered);
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      exportClaimsToPDF(filteredClaims, 'My Claims');
    } else {
      exportClaimsToExcel(filteredClaims, 'my_claims');
    }
    setShowExportMenu(false);
  };

  const filters = ['ALL', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PAID'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
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
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg"
      >
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims by title, number, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter size={20} className="text-gray-600 flex-shrink-0" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8 animate-pulse-custom">Loading...</div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No claims found. {searchQuery ? 'Try a different search.' : 'Create your first claim!'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClaims.map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/claims/${claim.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{claim.title}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(
                              claim.status
                            )}`}
                          >
                            {claim.status}
                          </span>
                          {claim.hasViolations && (
                            <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                              Policy Violations
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{claim.claimNumber}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(claim.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-left lg:text-right w-full lg:w-auto">
                        <p className="font-semibold text-lg">
                          {claim.currency} {claim.totalAmount.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-600">{claim.items.length} items</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
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
