import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { Trash2, Eye } from 'lucide-react';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual endpoint
        setUsers([
          { _id: '1', email: 'user1@example.com', phone: '1234567890', role: 'user', createdAt: '2025-01-01' },
          { _id: '2', email: 'user2@example.com', phone: '0987654321', role: 'user', createdAt: '2025-01-02' },
          { _id: '3', email: 'seller@example.com', phone: '5555555555', role: 'user', createdAt: '2025-01-03' },
        ]);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
        <p className="text-slate-500 mt-2">Manage and monitor all registered users</p>
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.phone}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-3">
                  <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
