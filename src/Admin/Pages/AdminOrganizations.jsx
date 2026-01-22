import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Shield, XCircle, Plus } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import AddOrganizationModal from '../Components/AddOrganizationModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOrganizations = async (cursorToLoad = null, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else if (initialized) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      const { data } = await apiClient.get('/admin/organizations', {
        params: {
          limit,
          cursor: cursorToLoad,
          search: filters.search || undefined,
          status: filters.status || undefined,
        },
      });
      if (isLoadMore) {
        setOrganizations((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setOrganizations(data?.data || []);
      }
      setNextCursor(data?.nextCursor || null);
      setHasMore(data?.hasMore || false);
      setInitialized(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrganizations(null);
  }, [filters]);

  const handleApprove = async (id) => {
    try {
      await apiClient.patch(`/admin/organizations/${id}/approve`);
      setActionMessage('Organization approved');
      setOrganizations((prev) => prev.map((org) => (org._id === id ? { ...org, status: 'active' } : org)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.patch(`/admin/organizations/${id}/reject`);
      setActionMessage('Organization rejected');
      setOrganizations((prev) => prev.map((org) => (org._id === id ? { ...org, status: 'blocked' } : org)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Rejection failed');
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    await fetchOrganizations(nextCursor, true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setNextCursor(null);
  };

  const statusBadge = (status) => {
    const map = {
      pending_approval: 'bg-amber-100 text-amber-800',
      active: 'bg-emerald-100 text-emerald-800',
      blocked: 'bg-rose-100 text-rose-800',
      pending: 'bg-slate-100 text-slate-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
  };

  const handleModalSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
    fetchOrganizations(null);
  };

  if (!initialized && loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-600 text-sm">Review and approve organization accounts.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:shadow-lg transition-all inline-flex items-center gap-2 font-medium"
          >
            <Plus size={18} /> Add Organization
          </button>
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search name or email"
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All statuses</option>
            <option value="pending_approval">Pending approval</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            onClick={() => fetchOrganizations(null)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700">{error}</div>
      )}
      {successMessage && (
        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">{successMessage}</div>
      )}
      {actionMessage && (
        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">{actionMessage}</div>
      )}

      <div className="overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">License File</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {organizations.map((org) => {
              const licenseUrl = org.licenseFile ? `${API_BASE_URL}/${org.licenseFile}` : null;
              const pending = org.status === 'pending_approval';
              return (
                <tr key={org._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                    <Shield size={16} className="text-sky-600" />
                    {org.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{org.email}</td>
                  <td className="px-4 py-3 text-slate-700">{org.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(org.status)}`}>
                      {org.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {licenseUrl ? (
                      <a
                        href={licenseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900"
                      >
                        <FileText size={16} />
                        View file
                      </a>
                    ) : (
                      <span className="text-slate-400">No file</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        onClick={() => handleApprove(org._id)}
                        title="Approve organization"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
                        onClick={() => handleReject(org._id)}
                        title="Reject organization"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {organizations.length === 0 && (
          <div className="p-6 text-center text-slate-500">No organizations found.</div>
        )}
      </div>

      <div className="flex items-center justify-end text-sm text-slate-600">
        <div className="space-x-2">
          <button
            onClick={() => fetchOrganizations(null)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
          >
            Refresh
          </button>
          <button
            onClick={loadMore}
            disabled={!hasMore || loadingMore}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : hasMore ? 'Load more' : 'No more'}
          </button>
        </div>
      </div>

      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
