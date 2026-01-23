import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { Trash2, Eye, CheckCircle, XCircle, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminBikePosts() {
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    paymentStatus: 'all', // all, pending, paid
    postStatus: 'all', // all, active, pending, rejected, sold
  });
  const navigate = useNavigate();

  const fetchBikes = async (cursor) => {
    try {
      setLoading(!cursor);
      setError('');
      
      const params = new URLSearchParams();
      params.append('limit', '10');
      params.append('vehicleType', 'bike');
      if (cursor) params.append('cursor', cursor);
      
      if (filters.paymentStatus !== 'all') {
        params.append('paymentStatus', filters.paymentStatus);
      }
      if (filters.postStatus !== 'all') {
        params.append('status', filters.postStatus);
      }
      
      const { data } = await apiClient.get(`/vehicles/filtered-listings?${params}`);
      console.log(data);

      const items = data?.data || [];
      const pageInfo = data?.pageInfo || {};

      if (cursor) {
        setBikes(prev => [...prev, ...items]);
      } else {
        setBikes(items);
      }

      setNextCursor(pageInfo.nextCursor || null);
      setHasMore(!!pageInfo.hasNextPage);
    } catch (err) {
      console.error('Failed to fetch bikes:', err);
      setError(err.response?.data?.message || 'Failed to load bike posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNextCursor(null);
    fetchBikes();
  }, [filters]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchBikes(nextCursor);
  };

  const updateStatus = async (bikeId, status, confirmMessage, successMessage) => {
    if (!confirm(confirmMessage)) return;
    try {
      await apiClient.patch(`/vehicles/status/${bikeId}`, { status });
      alert(successMessage);
      fetchBikes();
    } catch (err) {
      console.error('Failed to update bike status:', err);
      alert(err.response?.data?.message || 'Failed to update bike status');
    }
  };

  const handleApprove = (bikeId) => updateStatus(bikeId, 'active', 'Are you sure you want to approve this bike post?', 'Bike post approved successfully!');
  const handleReject = (bikeId) => updateStatus(bikeId, 'rejected', 'Are you sure you want to reject this bike post?', 'Bike post rejected successfully!');

  const handleDelete = async (bikeId) => {
    if (!confirm('Are you sure you want to delete this bike post?')) return;
    try {
      await apiClient.delete(`/vehicles/${bikeId}`);
      alert('Bike post deleted successfully!');
      fetchBikes();
    } catch (err) {
      console.error('Failed to delete bike:', err);
      alert(err.response?.data?.message || 'Failed to delete bike post');
    }
  };

  const getPostStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    const statusStyles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      rejected: 'bg-red-100 text-red-700',
      sold: 'bg-blue-100 text-blue-700',
    };
    return statusStyles[s] || 'bg-slate-100 text-slate-700';
  };

  const getPaymentStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    return s === 'paid' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-amber-100 text-amber-700';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-slate-50">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bike className="text-sky-600" size={32} />
          <h1 className="text-3xl font-bold text-slate-900">Bike Posts Management</h1>
        </div>
        <p className="text-slate-500">Manage all bike listings on the platform</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Post Status</label>
            <select
              value={filters.postStatus}
              onChange={(e) => setFilters({ ...filters, postStatus: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">All Vehicle Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bikes Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Bike</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Mileage</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Seller</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Post Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bikes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No bike posts found
                  </td>
                </tr>
              ) : (
                bikes.map((bike) => (
                  <tr key={bike._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{[bike.make, bike.modelName].filter(Boolean).join(' ')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{bike.vehicleType}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">৳{bike.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{(bike.mileage ?? 0).toLocaleString()} km</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{bike.userId?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostStatusBadge(bike.status)}`}>
                        {String(bike.status || '').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(bike.paymentStatus)}`}>
                        {String(bike.paymentStatus || '').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApprove(bike._id)}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleReject(bike._id)}
                          className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                          title="View Details"
                          onClick={() => navigate(`/vehicles/${bike._id}`)}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(bike._id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {bikes.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-center">
            <button
              onClick={loadMore}
              disabled={!hasMore || loading}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                hasMore
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {hasMore ? 'Load More' : 'No More Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
