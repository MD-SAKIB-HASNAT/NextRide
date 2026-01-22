import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Bike, Car, CheckCircle, Filter, MapPin, Tag, X, Pencil, Trash2 } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function MyListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get("type") || "all";
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [statusFilter, setStatusFilter] = useState("all");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: '12',
        });
        
        // Only add filters if not 'all'
        if (typeFilter !== 'all') {
          params.append('vehicleType', typeFilter);
        }
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        
        //console.log('Filters:', { typeFilter, statusFilter });
        //console.log('API URL:', `/vehicles/filtered-listings?${params}`);
        
        const { data } = await apiClient.get(`/vehicles/filtered-listings?${params}`);
        //console.log('Response:', data);
        
        setListings(data.data || []);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [typeFilter, statusFilter]);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const params = new URLSearchParams({
        limit: '12',
        cursor: nextCursor,
      });
      
      // Only add filters if not 'all'
      if (typeFilter !== 'all') {
        params.append('vehicleType', typeFilter);
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const { data } = await apiClient.get(`/vehicles/filtered-listings?${params}`);
      setListings(prev => [...prev, ...(data.data || [])]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more listings");
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredListings = useMemo(() => {
    return listings;
  }, [listings]);

  const updateType = (value) => {
    setTypeFilter(value);
    if (value === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", value);
    }
    setSearchParams(searchParams);
  };

  const markAsSold = async (id) => {
    const confirmSale = window.confirm("Mark this listing as sold?");
    if (!confirmSale || updatingId) return;

    try {
      setUpdatingId(id);
      await apiClient.patch(`/vehicles/${id}/mark-sold`);
      setListings((prev) => {
        const updated = prev.map((item) =>
          item._id === id ? { ...item, status: "sold" } : item
        );

        if (statusFilter !== "all" && statusFilter !== "sold") {
          return updated.filter((item) => item.status === statusFilter);
        }

        return updated;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as sold");
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeClass = (status) => {
    if (status === "active") return "bg-emerald-100 text-emerald-700";
    if (status === "review") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-700";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Listings</p>
            <h1 className="text-3xl font-bold text-slate-900">My Vehicle Posts</h1>
            <p className="text-sm text-slate-500">Filter by type and listing status</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:-translate-y-0.5 transition"
          >
            <X size={16} /> Back
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Filter size={16} className="text-slate-500" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              value={typeFilter}
              onChange={(e) => updateType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
            </select>
          </div>
          <select
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Any status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((item) => (
            <div key={item._id} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{item._id.slice(-6)}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.make} {item.modelName}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} className="text-blue-500" /> {item.location}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass(item.status)}`}>
                  {item.status}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                  <Tag size={14} className="text-amber-500" /> ৳ {item.price.toLocaleString()}
                </span>
                <span className="text-slate-500 capitalize">{item.vehicleType}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                  item.paymentStatus === "paid"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}>
                  <CheckCircle size={14} /> {item.paymentStatus === "paid" ? "Payment received" : "Payment pending"}
                </span>
                <span className="text-slate-500">Posted {formatDate(item.createdAt)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {item.status !== "sold" && (
                  <button
                    onClick={() => markAsSold(item._id)}
                    disabled={updatingId === item._id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={14} />
                    {updatingId === item._id ? "Marking..." : "Mark Sold"}
                  </button>
                )}
                <button
                  onClick={() => navigate(`/sell/${item._id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={async () => {
                    const ok = window.confirm('Delete this listing? This cannot be undone.');
                    if (!ok) return;
                    try {
                      await apiClient.delete(`/vehicles/${item._id}`);
                      setListings(prev => prev.filter(v => v._id !== item._id));
                    } catch (err) {
                      alert(err.response?.data?.message || 'Failed to delete');
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

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

        {filteredListings.length === 0 && (
          <div className="mt-8 text-center text-slate-500">No listings found for this filter.</div>
        )}
      </div>
    </div>
  );
}
