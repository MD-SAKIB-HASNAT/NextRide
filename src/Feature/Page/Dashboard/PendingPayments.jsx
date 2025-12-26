import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Tag,
  ChevronRight,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../Components/LoadingSpiner";

export default function PendingPayments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: '12',
          paymentStatus: 'pending',
        });
        const { data } = await apiClient.get(`/vehicles/user/my-listings-filtered?${params}`);
        
        setPendingListings(data.data || []);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const params = new URLSearchParams({
        limit: '12',
        cursor: nextCursor,
        paymentStatus: 'pending',
      });
      const { data } = await apiClient.get(`/vehicles/user/my-listings-filtered?${params}`);
      setPendingListings(prev => [...prev, ...(data.data || [])]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load more listings");
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePayNow = (listingId) => {
    navigate(`/payment/${listingId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-2 transition"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Pending Payments</h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete payment to activate your listings
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200">
            <CreditCard size={18} className="text-amber-700" />
            <span className="text-sm font-semibold text-amber-800">
              {pendingListings.length} pending
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Pending Listings */}
        {pendingListings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <CreditCard size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              All caught up!
            </h2>
            <p className="text-slate-500">
              You have no pending payments at the moment.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Listing Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      {listing.images && listing.images.length > 0 && (
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${listing.images[0]}`}
                            alt={listing.modelName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {listing.make} {listing.modelName}
                            </h3>
                            <p className="text-sm text-slate-500 capitalize">
                              {listing.vehicleType} • {listing.fuelType} • {listing.year}
                            </p>
                          </div>
                          <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-semibold border border-amber-200">
                            Pending Payment
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
                          <div className="flex items-center gap-1">
                            <Tag size={16} className="text-sky-500" />
                            <span className="font-semibold text-slate-900">
                              ৳ {listing.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-slate-400" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-slate-400" />
                            <span>Posted {formatDate(listing.createdAt)}</span>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                          <span>Mileage: {listing.mileage.toLocaleString()} km</span>
                          <span>Condition: {listing.condition}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handlePayNow(listing._id)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition"
                    >
                      <CreditCard size={18} />
                      Pay Now
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && pendingListings.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-md"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
