import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail, Phone, Briefcase, FileText } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border border-sky-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Welcome, {user.name}!
              </h1>
              <p className="text-base text-slate-500">
                Manage your NextRide account and activities
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-300 px-6 py-3 text-red-600 font-medium hover:bg-red-50 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={24} className="text-sky-500" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-500">Full Name</label>
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <p className="text-lg font-semibold text-slate-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500 flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </label>
                <p className="text-lg font-semibold text-slate-900">{user.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase size={24} className="text-sky-500" />
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-500">Account Type</label>
                <p className="text-lg font-semibold text-slate-900 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Status</label>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {user.status || "Active"}
                </span>
              </div>
              <div>
                <label className="text-sm text-slate-500">Email Verified</label>
                <p className="text-lg font-semibold text-green-600">✓ Yes</p>
              </div>
            </div>
          </div>
        </div>

        {/* License File Info (if organization) */}
        {user.role === "organization" && user.licenseFile && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={24} className="text-sky-500" />
              Organization License
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-slate-700">License file uploaded and verified</p>
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Verified
              </span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-white font-medium text-center hover:shadow-lg transition"
            >
              Browse Vehicles
            </a>
            <a
              href="/sell"
              className="rounded-xl border border-sky-300 px-6 py-3 text-sky-600 font-medium text-center hover:bg-sky-50 transition"
            >
              Sell Vehicle
            </a>
            <a
              href="/settings"
              className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 font-medium text-center hover:bg-slate-50 transition"
            >
              Account Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
