import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCcw, ShieldCheck, Truck, Users } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [overviewRes, settingsRes] = await Promise.all([
          apiClient.get('/admin/dashboard/overview'),
          apiClient.get('/admin/settings'),
        ]);
        setOverview(overviewRes.data);
        setSettings(settingsRes.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load admin overview');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {overview && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <StatCard title="Total Vehicles" value={overview.totalVehicles} tone="from-sky-500 to-blue-600" icon={<Truck size={20} />} />
            <StatCard title="Active Listings" value={overview.activeCount} tone="from-emerald-500 to-teal-600" icon={<ShieldCheck size={20} />} />
            <StatCard title="Pending Approvals" value={overview.pendingCount} tone="from-amber-500 to-orange-600" icon={<ShieldCheck size={20} />} />
            <StatCard title="Update Requests" value={overview.pendingUpdateRequests} tone="from-indigo-500 to-purple-600" icon={<RefreshCcw size={20} />} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Platform Fees"
              value={`৳ ${overview.totalPlatformFee?.toLocaleString() || 0}`}
              tone="from-slate-900 to-slate-700"
              icon={<BarChart3 size={20} />}
            />
            <StatCard
              title="Registered Users"
              value={overview.totalUsers}
              tone="from-cyan-500 to-blue-500"
              icon={<Users size={20} />}
            />
            <StatCard
              title="Platform Fee Rate"
              value={`${((settings?.platformFeeRate ?? 0)).toFixed(1)}%`}
              tone="from-rose-500 to-red-600"
              icon={<BarChart3 size={20} />}
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, tone }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value ?? 0}</p>
      </div>
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${tone} text-white flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}
