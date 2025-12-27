import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Users, Truck, BarChart3, TrendingUp } from 'lucide-react';
import apiClient from '../../api/axiosInstance';

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    activeListings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // TODO: replace with real endpoints
        setStats({
          totalUsers: 2450,
          totalVehicles: 1280,
          activeListings: 856,
          totalRevenue: 125400,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Vehicles</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalVehicles}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Truck className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Listings</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeListings}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">${(stats.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">New User Registration</p>
                <p className="text-sm text-slate-500">5 minutes ago</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">New</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Vehicle Listed</p>
                <p className="text-sm text-slate-500">15 minutes ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Listed</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Payment Received</p>
                <p className="text-sm text-slate-500">1 hour ago</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Paid</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Conversion Rate</span>
              <span className="font-semibold text-slate-900">3.2%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">User Growth</span>
                <span className="font-semibold text-slate-900">+12.5%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
