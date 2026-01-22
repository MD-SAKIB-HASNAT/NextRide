import React from 'react';
import { BarChart3, Users, Truck, TrendingUp, Settings, Podcast, Car, Bike, Shield, KeySquare, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminNav({ sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const navItem = (icon, label, path) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        isActive(path)
          ? 'bg-sky-500 text-white font-semibold'
          : 'hover:bg-blue-700 text-white'
      } ${sidebarOpen ? 'px-4' : 'justify-center'}`}
      onClick={() => navigate(path)}
    >
      {icon}
      {sidebarOpen && <span>{label}</span>}
    </div>
  );

  return (
    <nav className="flex-1 p-4 space-y-2 shadow-2xl bg-blue-950 text-white">
      {navItem(<BarChart3 size={20} />, 'Dashboard', '/admin')}
      {navItem(<Bike size={20} />, 'Bike Posts', '/admin/bike-posts')}
      {navItem(<Car size={20} />, 'Car Posts', '/admin/car-posts')}
      {navItem(<Shield size={20} />, 'Organizations', '/admin/organizations')}
      {navItem(<Users size={20} />, 'Users', '/admin/users')}
      {navItem(<KeySquare size={20} />, 'Rent Vehicles', '/admin/rent-vehicles')}
      
      {navItem(<Truck size={20} />, 'Vehicles Update Requests', '/admin/vehicle-update-requests')}
      {navItem(<TrendingUp size={20} />, 'Analytics', '/admin/analytics')}
      {navItem(<CreditCard size={20} />, 'Payment History', '/admin/payment-history')}
      {navItem(<Settings size={20} />, 'Settings', '/admin/settings')}
    </nav>
  );
}
