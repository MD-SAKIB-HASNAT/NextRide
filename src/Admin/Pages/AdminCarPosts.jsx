import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { Trash2, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminCarPosts() {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    paymentStatus: 'all', 
    postStatus: 'all', 
  });
  const navigate = useNavigate();

  const fetchCars = async (cursor) => {
    try {
      setLoading(!cursor);
      setError('');
      
      const params = new URLSearchParams();
      params.append('limit', '10');
      params.append('vehicleType', 'car');
      if (cursor) params.append('cursor', cursor);
      
      if (filters.paymentStatus !== 'all') {
        params.append('paymentStatus', filters.paymentStatus);
      }
      if (filters.postStatus !== 'all') {
        params.append('status', filters.postStatus);
      }
      const { data } = await apiClient.get(`/vehicles/filtered-listings?${params}`);

      const items = data?.data || [];
      const pageInfo = data?.pageInfo || {};

      if (cursor) {
        setCars(prev => [...prev, ...items]);
      } else {
        setCars(items);
      }

      setNextCursor(pageInfo.nextCursor || null);
      setHasMore(!!pageInfo.hasNextPage);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError(err.response?.data?.message || 'Failed to load car posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset list when filters change
    setNextCursor(null);
    fetchCars();
  }, [filters]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    await fetchCars(nextCursor);
  };

  const updateStatus = async (carId, status, confirmMessage, successMessage) => {
    if (!confirm(confirmMessage)) return;
    try {
      await apiClient.patch(`/vehicles/status/${carId}`, { status });
      alert(successMessage);
      fetchCars();
    } catch (err) {
      console.error('Failed to update car status:', err);
      alert(err.response?.data?.message || 'Failed to update car status');
    }
  };

  const handleApprove = (carId) => updateStatus(carId, 'active', 'Are you sure you want to approve this car post?', 'Car post approved successfully!');
  const handleReject = (carId) => updateStatus(carId, 'rejected', 'Are you sure you want to reject this car post?', 'Car post rejected successfully!');

  const handleDelete = async (carId) => {
    if (!confirm('Are you sure you want to delete this car post?')) return;
    try {
      await apiClient.delete(`/vehicles/${carId}`);
      alert('Car post deleted successfully!');
      fetchCars();
    } catch (err) {
      console.error('Failed to delete car:', err);
      alert(err.response?.data?.message || 'Failed to delete car post');
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
          <Car className="text-sky-600" size={32} />
          <h1 className="text-3xl font-bold text-slate-900">Car Posts Management</h1>
        </div>
        <p className="text-slate-500">Manage all car listings on the platform</p>
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
              <option value="all">All Post Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Car</th>
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
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No car posts found
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{[car.make, car.modelName].filter(Boolean).join(' ')}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{car.vehicleType}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">৳{car.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{(car.mileage ?? 0).toLocaleString()} km</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{car.userId?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostStatusBadge(car.status)}`}>
                        {String(car.status || '').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(car.paymentStatus)}`}>
                        {String(car.paymentStatus || '').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApprove(car._id)}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleReject(car._id)}
                          className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/vehicles/${car._id}`)}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(car._id)}
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
        {cars.length > 0 && (
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
