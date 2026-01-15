import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CreditCard,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
  Clock,
  Truck,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";

import LoadingSpinner from "../../../Components/LoadingSpiner";
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    bikeCount: 0,
    carCount: 0,
    totalCount: 0,
    pendingCount: 0,
    rentVehicleCount: 0,
  });


  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !userData) {
      navigate("/login");
      return;
    }
    if(userData.role === 'admin'){
      navigate("/admin");
      return;
    }

    setUser(userData);
    
    // Fetch user summary from backend
    const fetchUserData = async () => {
      try {
        const summaryRes = await apiClient.get("/user/summary");
        const summary = summaryRes.data || {};
        console.log(summary);
        
        setStats({
          bikeCount: summary.bikePostCount ?? 0,
          carCount: summary.carPostCount ?? 0,
          totalCount: summary.totalListings ?? 0,
          pendingCount: summary.pendingCount ?? 0,
          rentVehicleCount: summary.rentVehicleCount ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch user summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  const handleStatClick = (targetType) => {
    navigate(`/my-listings?type=${targetType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <aside className="lg:col-span-2 xl:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xl font-semibold shadow-lg overflow-hidden">
                {user.profilePhoto ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}/${user.profilePhoto}`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.slice(0, 1) || "N"
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Dashboard</p>
                <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <User size={18} className="text-blue-600" />
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={18} className="text-blue-600" />
                <span>{user.phone || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail size={18} className="text-blue-600" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Shield size={18} className="text-emerald-500" />
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">Verified</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 px-4 py-3 font-semibold hover:bg-blue-100 transition"
            >
              <User size={16} /> Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-600 border border-red-100 px-4 py-3 font-semibold hover:bg-red-100 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </aside>

          <main className="lg:col-span-4 xl:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleStatClick("all")}
                className="text-left bg-gradient-to-br from-blue-700 to-slate-900 text-white rounded-3xl shadow-lg p-6 hover:-translate-y-0.5 transition transform"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-100">Manage My posts</p>
                  <Activity size={22} />
                </div>
                <h3 className="text-3xl font-bold mt-2">{stats.totalCount}</h3>
                <p className="text-xs text-blue-200 mt-1">{stats.bikeCount} bikes • {stats.carCount} cars</p>
              </button>
              <button
                type="button"
                onClick={() => navigate("/analytics")}
                className="text-left bg-white rounded-3xl shadow-lg p-6 border border-slate-100 hover:-translate-y-0.5 transition transform cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Analytics</p>
                  <Activity size={22} className="text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">View Stats</h3>
                <p className="text-xs text-slate-400 mt-1">See detailed analytics</p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => navigate("/pending-payments")}
                className="text-left bg-white rounded-3xl shadow-lg p-6 border border-slate-100 hover:-translate-y-0.5 transition transform cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Pending Payments</p>
                  <CreditCard size={22} className="text-amber-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingCount}</h3>
              </button>
              <button
                type="button"
                onClick={() => navigate("/pending-updates")}
                className="text-left bg-white rounded-3xl shadow-lg p-6 border border-slate-100 hover:-translate-y-0.5 transition transform cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Pending Updates</p>
                  <Clock size={22} className="text-sky-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">View</h3>
                <p className="text-xs text-slate-400 mt-1">Check update requests</p>
              </button>
            </div>

            {user?.role === "organization" && (
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/my-rent-listings")}
                  className="text-left bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl shadow-lg p-6 hover:-translate-y-0.5 transition transform cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-emerald-100">Manage Rent Vehicles</p>
                    <Truck size={22} />
                  </div>
                  <h3 className="text-3xl font-bold mt-2">{stats.rentVehicleCount}</h3>
                  <p className="text-xs text-emerald-200 mt-1">Control vehicle availability</p>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
