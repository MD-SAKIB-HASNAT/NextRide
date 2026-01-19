import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, X, MapPin, Tag } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function PendingUpdates() {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async (cursor) => {
    try {
      setLoading(!cursor);
      const params = new URLSearchParams({ limit: "12" });
      if (cursor) {
        params.append("cursor", cursor);
      }

      const response = await apiClient.get(`/vehicles/updates-requests/list?${params}`);
      const responseData = response.data;
      
      // Handle both response structures
      const items = responseData?.data || responseData || [];
      const pageInfo = responseData?.pageInfo || { hasNextPage: false, nextCursor: null };
      
      if (cursor) {
        setUpdates(prev => [...prev, ...items]);
      } else {
        setUpdates(items);
      }
      
      setNextCursor(pageInfo.nextCursor || null);
      setHasMore(!!pageInfo.hasNextPage);
      setError("");
    } catch (err) {
      console.error("Error fetching updates:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load pending updates";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    await fetchUpdates(nextCursor);
  };

  const badgeClass = (status) => {
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Updates</p>
            <h1 className="text-3xl font-bold text-slate-900">Pending Update Requests</h1>
            <p className="text-sm text-slate-500">Track status of your listing updates</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:-translate-y-0.5 transition"
          >
            <X size={16} /> Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {updates.map((item) => (
            <div key={item._id} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{item._id.slice(-6)}</p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.vehicleId?.make} {item.vehicleId?.modelName}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} className="text-blue-500" /> {item.vehicleId?.location}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeClass(item.status)}`}>
                  {item.status === "in-review" ? "In Review" : item.status}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                  <Tag size={14} className="text-amber-500" /> ৳ {item.vehicleId?.price.toLocaleString()}
                </span>
                <span className="text-slate-500 capitalize">{item.vehicleId?.vehicleType}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                  item.status === "approved"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : item.status === "rejected"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}>
                  {item.status === "approved" ? (
                    <>
                      <CheckCircle size={14} /> Approved
                    </>
                  ) : item.status === "rejected" ? (
                    <>
                      <X size={14} /> Rejected
                    </>
                  ) : (
                    <>
                      <Clock size={14} /> Pending
                    </>
                  )}
                </span>
                <span className="text-slate-500">Submitted {formatDate(item.createdAt)}</span>
              </div>

              {item.note && (
                <div className="mt-2 p-3 rounded-lg bg-slate-100 border-l-4 border-slate-400">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Admin Note:</p>
                  <p className="text-xs text-slate-600">{item.note}</p>
                </div>
              )}

              <button
                onClick={() => navigate(`/vehicles/${item.vehicleId?._id}`)}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 py-2 transition"
              >
                View Listing
              </button>
            </div>
          ))}
        </div>

        {updates.length === 0 && !error && (
          <div className="mt-8 text-center text-slate-500">
            <Clock size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-lg">No pending updates yet</p>
            <p className="text-sm">Your update requests will appear here</p>
          </div>
        )}

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition inline-flex items-center gap-2"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
