import React, { useEffect, useState } from "react";
import { CheckCircle2, Eye, Loader2, XCircle } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import apiClient from "../../api/axiosInstance";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  "in-review": "bg-indigo-100 text-indigo-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

export default function AdminVehicleUpdateRequests() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionState, setActionState] = useState({ id: null, action: null });
  const [requests, setRequests] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, nextCursor: undefined });
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", vehicleType: "" });

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchRequests = async (cursor) => {
    try {
      setError("");
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const { data } = await apiClient.get("/vehicles/updates-requests/list", {
        params: {
          cursor,
          status: filters.status || undefined,
          vehicleType: filters.vehicleType || undefined,
        },
      });

      const incoming = data?.data || [];
      setRequests((prev) => (cursor ? [...prev, ...incoming] : incoming));
      setPageInfo(data?.pageInfo || { hasNextPage: false, nextCursor: undefined });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load update requests";
      setError(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      let note;
      
      // Confirm action
      if (action === "approve") {
        const confirmed = window.confirm(
          'Are you sure you want to approve this vehicle update? The seller will receive a confirmation email.'
        );
        if (!confirmed) return;
      } else if (action === "reject") {
        note = window.prompt("Add a note for rejection (optional):", "");
        if (note === null) {
          return;
        }
      }

      setActionState({ id: requestId, action });
      await apiClient.patch(`/vehicles/admin/update-requests/${requestId}`, {
        action,
        note: note || undefined,
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req,
        ),
      );
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to update request";
      setError(message);
    } finally {
      setActionState({ id: null, action: null });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageInfo({ hasNextPage: false, nextCursor: undefined });
  };

  const handleView = (vehicleId) => {
    if (!vehicleId) return;
    window.open(`/vehicles/${vehicleId}`, "_blank", "noopener,noreferrer");
  };

  const renderStatus = (status) => {
    const classes = STATUS_STYLES[status] || "bg-slate-100 text-slate-700";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${classes}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vehicle Update Requests</h1>
          <p className="text-slate-500 mt-2">Review, approve, or reject seller-submitted vehicle changes.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-review">In review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleFilterChange}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="">All vehicle types</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>

          <button
            className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
            onClick={() => fetchRequests()}
            disabled={loading}
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

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Vehicle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Seller</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Submitted</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={5}>
                  No update requests found.
                </td>
              </tr>
            )}

            {requests.map((req) => {
              const vehicle = req.vehicleId || {};
              const user = req.userId || {};
              const isBusy = actionState.id === req._id;

              return (
                <tr key={req._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{`${vehicle.make || "Unknown"} ${vehicle.modelName || ""}`.trim()}</span>
                      <span className="text-xs text-slate-500">
                        {`${vehicle.vehicleType?.toUpperCase() || "TYPE"} • tk.${vehicle.price ? Number(vehicle.price).toLocaleString() : "N/A"}`}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{user.name || "Unknown User"}</span>
                      <span className="text-xs text-slate-500">{user.email || "No email"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">{renderStatus(req.status)}</td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleView(vehicle._id)}
                        disabled={!vehicle._id}
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>

                      <button
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isBusy}
                        onClick={() => handleAction(req._id, "approve")}
                      >
                        {isBusy && actionState.action === "approve" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        <span>Approve</span>
                      </button>

                      <button
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isBusy}
                        onClick={() => handleAction(req._id, "reject")}
                      >
                        {isBusy && actionState.action === "reject" ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                        <span>Reject</span>
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
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fetchRequests(pageInfo.nextCursor)}
            disabled={loadingMore}
          >
            {loadingMore ? <Loader2 size={18} className="animate-spin" /> : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
