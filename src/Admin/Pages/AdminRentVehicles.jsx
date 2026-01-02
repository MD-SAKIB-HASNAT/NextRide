import React, { useEffect, useState } from "react";
import { Eye, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import apiClient from "../../api/axiosInstance";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const STATUS_BADGES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function AdminRentVehicles() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionState, setActionState] = useState({ id: null, action: null });
  const [vehicles, setVehicles] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, nextCursor: null });
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", vehicleType: "", availability: "" });

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchVehicles = async (cursor = null) => {
    try {
      setError("");
      if (cursor) setLoadingMore(true);
      else setLoading(true);

      const { data } = await apiClient.get("/rent/admin/list", {
        params: {
          cursor,
          status: filters.status || undefined,
          vehicleType: filters.vehicleType || undefined,
          availability: filters.availability || undefined,
          search: filters.search || undefined,
        },
      });

      if (cursor) {
        setVehicles((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setVehicles(data?.data || []);
      }

      setPageInfo(data?.pageInfo || { hasNextPage: false, nextCursor: null });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rent vehicles");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageInfo({ hasNextPage: false, nextCursor: null });
  };

  const handleStatus = async (vehicleId, status) => {
    try {
      setActionState({ id: vehicleId, action: status });
      await apiClient.patch(`/rent/admin/${vehicleId}/status`, { status });
      setVehicles((prev) => prev.map((v) => (v._id === vehicleId ? { ...v, status } : v)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActionState({ id: null, action: null });
    }
  };

  if (loading && !vehicles.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-slate-50">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rent Vehicles</h1>
          <p className="text-slate-500 mt-2">Review, approve, or reject rent vehicle listings.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm">
            <Search size={14} className="text-slate-500 mr-2" />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search model, address, contact"
              className="outline-none text-sm"
            />
          </div>
          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => fetchVehicles()}
            className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Model</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price/Day</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Availability</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={8}>
                  No rent vehicles found.
                </td>
              </tr>
            )}

            {vehicles.map((vehicle) => {
              const isBusy = actionState.id === vehicle._id;
              return (
                <tr key={vehicle._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{vehicle.vehicleModel}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{vehicle.vehicleType}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{vehicle.address}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{vehicle.contactNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 font-semibold">${vehicle.pricePerDay}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 capitalize">{vehicle.availability}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_BADGES[vehicle.status] || 'bg-slate-100 text-slate-700'}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                        onClick={() => window.open(`/rent/vehicle/${vehicle._id}`, '_blank')}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                        onClick={() => handleStatus(vehicle._id, 'approved')}
                        disabled={isBusy}
                        title="Approve"
                      >
                        {isBusy && actionState.action === 'approved' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      </button>
                      <button
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                        onClick={() => handleStatus(vehicle._id, 'rejected')}
                        disabled={isBusy}
                        title="Reject"
                      >
                        {isBusy && actionState.action === 'rejected' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageInfo?.hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchVehicles(pageInfo.nextCursor)}
            disabled={loadingMore}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
