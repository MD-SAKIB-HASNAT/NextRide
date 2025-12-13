import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-2 py-8">
      <div className="hidden md:flex flex-col justify-center px-16 bg-slate-100">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 leading-tight">
          Welcome to <span className="text-indigo-600">NextRide</span>
        </h1>
        <div className="w-16 h-1 bg-indigo-500 mb-6 rounded-full" />
        <p className="text-slate-600 max-w-md leading-relaxed text-lg">
          Buy, sell, and rent trusted bikes & cars across Bangladesh.
          Manage your listings, chat with buyers, and grow your business
          as an organization.
        </p>
        <div className="mt-10">
          <p className="text-sm text-slate-500 uppercase tracking-wide">
            Trusted Marketplace
          </p>
          <p className="text-lg font-semibold text-slate-800">
            For Users & Organizations
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 bg-slate-50">
        <div className="w-full bg-white rounded-xl shadow-md p-6">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
}
