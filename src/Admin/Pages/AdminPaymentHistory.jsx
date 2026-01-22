import React, { useEffect, useState } from 'react';
import { CreditCard, Search, Calendar, Filter, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';

export default function AdminPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [initialized, setInitialized] = useState(false);

  const fetchPayments = async (cursorToLoad = null, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else if (initialized) {
        setLoading(false);
      } else {
        setLoading(true);
      }
      setError('');

      const params = {
        limit: 20,
        cursor: cursorToLoad,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const { data } = await apiClient.get('/admin/payments/history', { params });

      if (isLoadMore) {
        setPayments((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setPayments(data?.data || []);
      }

      setNextCursor(data?.pageInfo?.nextCursor || null);
      setHasMore(data?.pageInfo?.hasNextPage || false);
      setInitialized(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPayments(null);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setNextCursor(null);
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchPayments(nextCursor, true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      success: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <CheckCircle size={14} /> },
      failed: { bg: 'bg-rose-100', text: 'text-rose-800', icon: <XCircle size={14} /> },
      cancelled: { bg: 'bg-slate-100', text: 'text-slate-700', icon: <XCircle size={14} /> },
      initiated: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} /> },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <AlertCircle size={14} /> },
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!initialized && loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <CreditCard className="text-sky-600" size={32} />
          Payment History
        </h1>
        <p className="text-slate-500 mt-2">View and manage all payment transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search transaction, email..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="initiated">Initiated</option>
            <option value="pending">Pending</option>
          </select>

          {/* Start Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setFilters({ status: '', search: '', startDate: '', endDate: '' })}
            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2"
          >
            <Filter size={16} /> Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">{payment.tran_id}</div>
                    <div className="text-xs text-slate-500">{payment.product_name || 'Platform Fee'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {payment.user?.name || payment.cus_name || 'N/A'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {payment.user?.email || payment.cus_email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {payment.vehicle ? (
                      <div className="text-sm">
                        <span className="font-medium text-slate-900">
                          {payment.vehicle.make} {payment.vehicle.modelName}
                        </span>
                        <div className="text-xs text-slate-500 capitalize">
                          {payment.vehicle.vehicleType}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">No vehicle</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-slate-900">
                      ৳{payment.amount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-slate-500">{payment.currency || 'BDT'}</div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(payment.status)}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-900">{formatDate(payment.completedAt || payment.createdAt)}</div>
                    <div className="text-xs text-slate-500">
                      {payment.completedAt ? 'Completed' : 'Created'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && !loading && (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-500 text-lg">No payment transactions found</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="text-sm font-medium text-emerald-800">Total Transactions</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{payments.length}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-800">Successful</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {payments.filter((p) => p.status === 'success').length}
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <div className="text-sm font-medium text-rose-800">Failed</div>
          <div className="text-2xl font-bold text-rose-900 mt-1">
            {payments.filter((p) => p.status === 'failed').length}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-sm font-medium text-amber-800">Pending</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {payments.filter((p) => p.status === 'pending' || p.status === 'initiated').length}
          </div>
        </div>
      </div>
    </div>
  );
}
