import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import apiClient from '../../api/axiosInstance';
import { TrendingUp, Users, Truck, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalVehicles: 0,
    activeListings: 0,
    monthlyGrowth: 0,
    vehicleSalesChart: [],
    userGrowthChart: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiClient.get('/admin/dashboard/analytics');
        setAnalytics(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const maxVehicleSales = Math.max(
    analytics.vehicleSalesChart.reduce((max, item) => Math.max(max, item.sales), 0),
    1
  );

  const maxUsers = Math.max(
    analytics.userGrowthChart.reduce((max, item) => Math.max(max, item.users), 0),
    1
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-500 mt-2">Platform performance and growth metrics</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">৳{analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalUsers.toLocaleString()}</p>
              <p className="text-xs font-medium text-emerald-600 mt-1">
                {analytics.monthlyGrowth >= 0 ? '+' : ''}{analytics.monthlyGrowth}% vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Vehicles */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Vehicles</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.totalVehicles.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Listings</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{analytics.activeListings.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Vehicle Sales</h3>
          <div className="space-y-4">
            {analytics.vehicleSalesChart.map((item) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="w-12 text-sm font-medium text-slate-600">{item.month}</span>
                <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600"
                    style={{ width: `${(item.sales / maxVehicleSales) * 100}%` }}
                  ></div>
                </div>
                <span className="w-12 text-sm font-semibold text-slate-900 text-right">{item.sales}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly User Growth</h3>
          <div className="space-y-4">
            {analytics.userGrowthChart.map((item) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="w-12 text-sm font-medium text-slate-600">{item.month}</span>
                <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                    style={{ width: `${(item.users / maxUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="w-16 text-sm font-semibold text-slate-900 text-right">{item.users}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
