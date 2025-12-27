import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Users, Truck, TrendingUp, LogOut, Menu, X } from 'lucide-react';

import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import AdminNav from '../Components/AdminNav';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Check if user is admin
      if (userData.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Layout handles auth check; child routes render content via Outlet

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-500 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className={`${!sidebarOpen && 'hidden'} font-bold text-lg`}>
            NextRide Admin
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <AdminNav sidebarOpen={sidebarOpen} />

        {/* Logout */}
        <div className="p-4 border-t bg-red-500 border-slate-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 transition ${
              sidebarOpen ? 'px-4' : 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user.name?.slice(0, 1) || 'A'}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
