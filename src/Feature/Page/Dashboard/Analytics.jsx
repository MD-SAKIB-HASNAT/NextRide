import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  ArrowLeft,
  Car,
  Bike,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  BarChart3,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../Components/LoadingSpiner";

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bikePostCount: 0,
    carPostCount: 0,
    totalListings: 0,
    pendingCount: 0,
    activeCount: 0,
    soldCount: 0,
    rejectedCount: 0,
    paidCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get("/user/summary");
        setStats({
          bikePostCount: data.bikePostCount ?? 0,
          carPostCount: data.carPostCount ?? 0,
          totalListings: data.totalListings ?? 0,
          pendingCount: data.pendingCount ?? 0,
          activeCount: data.activeCount ?? 0,
          soldCount: data.soldCount ?? 0,
          rejectedCount: data.rejectedCount ?? 0,
          paidCount: data.paidCount ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Overview</p>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track your listing performance</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:-translate-y-0.5 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Activity size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">Total</div>
            </div>
            <h3 className="text-4xl font-bold">{stats.totalListings}</h3>
            <p className="text-blue-100 text-sm mt-1">Total Listings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Bike size={24} className="text-purple-600" />
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900">{stats.bikePostCount}</h3>
            <p className="text-slate-500 text-sm mt-1">Bike Listings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Car size={24} className="text-sky-600" />
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <h3 className="text-4xl font-bold text-slate-900">{stats.carPostCount}</h3>
            <p className="text-slate-500 text-sm mt-1">Car Listings</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">Active</div>
            </div>
            <h3 className="text-4xl font-bold">{stats.activeCount}</h3>
            <p className="text-emerald-100 text-sm mt-1">Active Listings</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={24} className="text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900">Listing Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-amber-600" />
                  <span className="font-semibold text-slate-900">Pending Review</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">{stats.pendingCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-600" />
                  <span className="font-semibold text-slate-900">Active</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{stats.activeCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-blue-600" />
                  <span className="font-semibold text-slate-900">Sold</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.soldCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="flex items-center gap-3">
                  <XCircle size={20} className="text-red-600" />
                  <span className="font-semibold text-slate-900">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.rejectedCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={24} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Payment Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-600" />
                  <span className="font-semibold text-slate-900">Paid Listings</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{stats.paidCount}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-amber-600" />
                  <span className="font-semibold text-slate-900">Pending Payments</span>
                </div>
                <span className="text-2xl font-bold text-amber-600">{stats.pendingCount}</span>
              </div>

              {/* Stats Summary */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Payment Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {stats.totalListings > 0
                      ? Math.round((stats.paidCount / stats.totalListings) * 100)
                      : 0}%
                  </span>
                  <span className="text-sm text-slate-500">of listings paid</span>
                </div>
                <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    style={{
                      width: `${
                        stats.totalListings > 0
                          ? (stats.paidCount / stats.totalListings) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/my-listings")}
              className="p-4 rounded-xl border-2 border-sky-200 bg-sky-50 hover:bg-sky-100 transition text-left"
            >
              <Activity size={20} className="text-sky-600 mb-2" />
              <p className="font-semibold text-slate-900">View All Listings</p>
              <p className="text-xs text-slate-500 mt-1">Manage your posts</p>
            </button>
            <button
              onClick={() => navigate("/pending-payments")}
              className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-left"
            >
              <DollarSign size={20} className="text-amber-600 mb-2" />
              <p className="font-semibold text-slate-900">Pending Payments</p>
              <p className="text-xs text-slate-500 mt-1">Complete payments</p>
            </button>
            <button
              onClick={() => navigate("/sell")}
              className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition text-left"
            >
              <TrendingUp size={20} className="text-emerald-600 mb-2" />
              <p className="font-semibold text-slate-900">Create New Listing</p>
              <p className="text-xs text-slate-500 mt-1">Sell a vehicle</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
