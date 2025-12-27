import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { Trash2, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, Bike } from 'lucide-react';

export default function AdminBikePosts() {
  const [loading, setLoading] = useState(true);
  const [bikes, setBikes] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    paymentStatus: 'all', // all, pending, paid
    vehicleStatus: 'all', // all, active, pending, rejected, sold
  });

  const fetchBikes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('cursor', currentPage === 1 ? '' : currentPage.toString());
      params.append('limit', '10');
      params.append('vehicleType', 'bike');
      
      if (filters.paymentStatus !== 'all') {
        params.append('paymentStatus', filters.paymentStatus);
      }
      if (filters.vehicleStatus !== 'all') {
        params.append('vehicleStatus', filters.vehicleStatus);
      }
      
      const { data } = await apiClient.get(`/vehicles/filtered-listings?${params}`);
      
      setBikes(data.items || []);
      setTotalPages(data.hasMore ? currentPage + 1 : currentPage);
    } catch (err) {
      console.error('Failed to fetch bikes:', err);
      setError(err.response?.data?.message || 'Failed to load bike posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [currentPage, filters]);

  const handleApprove = async (bikeId) => {
    try {
      // await apiClient.put(`/admin/vehicles/${bikeId}/approve`);
      alert('Bike post approved successfully!');
      fetchBikes();
    } catch (err) {
      alert('Failed to approve bike post');
    }
  };

  const handleReject = async (bikeId) => {
    try {
      // await apiClient.put(`/admin/vehicles/${bikeId}/reject`);
      alert('Bike post rejected successfully!');
      fetchBikes();
    } catch (err) {
      alert('Failed to reject bike post');
    }
  };

  const handleDelete = async (bikeId) => {
    if (!confirm('Are you sure you want to delete this bike post?')) return;
    try {
      // await apiClient.delete(`/admin/vehicles/${bikeId}`);
      alert('Bike post deleted successfully!');
      fetchBikes();
    } catch (err) {
      alert('Failed to delete bike post');
    }
  };

  const getPostStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      rejected: 'bg-red-100 text-red-700',
      sold: 'bg-blue-100 text-blue-700',
    };
    return statusStyles[status.toLowerCase()] || 'bg-slate-100 text-slate-700';
  };

  const getPaymentStatusBadge = (status) => {
    return status === 'paid' 
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Status</label>
            <select
              value={filters.vehicleStatus}
              onChange={(e) => setFilters({ ...filters, vehicleStatus: e.target.value })}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Bike Model</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Make</th>
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
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{bike.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{bike.make}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">৳{bike.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{bike.mileage.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{bike.userId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostStatusBadge(bike.status)}`}>
                        {bike.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(bike.paymentStatus)}`}>
                        {bike.paymentStatus}
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

        {/* Pagination */}
        {bikes.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
