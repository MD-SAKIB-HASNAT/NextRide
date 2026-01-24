import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { Eye, PauseCircle, PlayCircle, Search } from 'lucide-react';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (cursor = null, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      setError('');

      const { data } = await apiClient.get('/admin/users', {
        params: {
          cursor,
          limit: 10,
          search: filters.search || undefined,
          status: filters.status || undefined,
        },
      });

      if (isLoadMore) {
        setUsers((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setUsers(data?.data || []);
      }

      setNextCursor(data?.nextCursor || null);
      setHasMore(Boolean(data?.hasMore));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleStatus = async (userId, status) => {
    const statusLabel = status === 'active' ? 'Activate' : 'Block';
    const confirmed = window.confirm(
      `Are you sure you want to ${statusLabel.toLowerCase()} this user? They will receive an email notification.`
    );
    
    if (!confirmed) return;

    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { status });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status } : u)));
      if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, status });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    await fetchUsers(nextCursor, true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setNextCursor(null);
  };

  if (loading && !users.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-500 mt-2">Manage and monitor all registered users</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm">
            <Search size={14} className="text-slate-500 mr-2" />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search name, email, phone"
              className="outline-none text-sm"
            />
          </div>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="pending_approval">Pending approval</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            onClick={() => fetchUsers()}
            className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-900">{user.name || user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : user.status === 'blocked'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                    onClick={() => setSelectedUser(user)}
                    title="View user"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-700 transition"
                    onClick={() => handleStatus(user._id, 'active')}
                    title="Set active"
                  >
                    <PlayCircle size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-rose-100 rounded-lg text-rose-700 transition"
                    onClick={() => handleStatus(user._id, 'blocked')}
                    title="Block user"
                  >
                    <PauseCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mt-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">User Details</h2>
              <p className="text-sm text-slate-500">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-900">Name:</span> {selectedUser.name || selectedUser.email}</div>
            <div><span className="font-semibold text-slate-900">Phone:</span> {selectedUser.phone}</div>
            <div><span className="font-semibold text-slate-900">Role:</span> {selectedUser.role}</div>
            <div><span className="font-semibold text-slate-900">Status:</span> {selectedUser.status}</div>
            <div><span className="font-semibold text-slate-900">Joined:</span> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '-'}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end text-sm text-slate-600 mt-4">
        <div className="space-x-2">
          <button
            onClick={loadMore}
            disabled={!hasMore || loadingMore}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : hasMore ? 'Load more' : 'No more'}
          </button>
        </div>
      </div>
    </div>
  );
}
