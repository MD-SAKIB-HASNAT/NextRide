import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-64px)]">
        <div className="hidden md:flex flex-col justify-center px-6 lg:px-12 bg-slate-100">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900 leading-tight">
            Welcome to <span className="text-indigo-600">NextRide</span>
          </h1>
          <div className="w-16 h-1 bg-indigo-500 mb-6 rounded-full" />
          <p className="text-slate-600 max-w-md leading-relaxed text-base lg:text-lg">
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

        <div className="flex items-center justify-center px-4 sm:px-6 py-8 overflow-auto">
            <Outlet />
        </div>
      </div>
    </div>
  );
}
