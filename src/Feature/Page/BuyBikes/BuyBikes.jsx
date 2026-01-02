import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, Search, X } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../Components/LoadingSpiner";
import VehicleCard from "../../../Components/VehicleCard";

const BIKE_BRANDS = [
  "Honda",
  "Yamaha",
  "Suzuki",
  "KTM",
  "BMW",
  "Harley-Davidson",
  "Royal Enfield",
  "Bajaj",
  "Hero",
  "Kawasaki",
  "Ducati",
  "Triumph",
  "QJ Motors",
  "GAS GAS",
];

export default function BuyBikes() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    make: "",
    minPrice: "",
    maxPrice: "",
    fromDate: "",
    toDate: "",
  });

  const fetchBikes = async (newFilters = null, isLoadMore = false) => {
    try {
      !isLoadMore && setLoading(true);
      if (isLoadMore) setLoadingMore(true);

      const filtersToUse = newFilters || filters;
      const params = new URLSearchParams();
      params.append("vehicleType", "bike");
      params.append("status", "active");

      // Add filter parameters
      if (filtersToUse.search) params.append("search", filtersToUse.search);
      if (filtersToUse.make) params.append("make", filtersToUse.make);
      if (filtersToUse.minPrice) params.append("minPrice", filtersToUse.minPrice);
      if (filtersToUse.maxPrice) params.append("maxPrice", filtersToUse.maxPrice);
      if (filtersToUse.fromDate) params.append("fromDate", filtersToUse.fromDate);
      if (filtersToUse.toDate) params.append("toDate", filtersToUse.toDate);

      params.append("limit", "12");
      if (isLoadMore && nextCursor) params.append("cursor", nextCursor);

      const endpoint = `/vehicles/public/filtered-listings?${params.toString()}`;

      const { data } = await apiClient.get(endpoint);

      if (isLoadMore) {
        setBikes((prev) => [...prev, ...(data.data || [])]);
      } else {
        setBikes(data.data || []);
      }

      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bikes");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setBikes([]);
    setNextCursor(null);
    setHasMore(false);
    fetchBikes(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      make: "",
      minPrice: "",
      maxPrice: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(emptyFilters);
    setBikes([]);
    setNextCursor(null);
    fetchBikes(emptyFilters);
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    await fetchBikes(null, true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Bike size={32} className="text-sky-600" />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Buy Bikes</h1>
              <p className="text-slate-600 mt-1">Browse available bikes for sale</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-slate-500">{bikes.length} bikes found</p>
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <Search size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Main Layout: Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-20">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Filters</h2>

              {/* All Button */}
              <button
                onClick={clearFilters}
                className="w-full mb-6 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:from-sky-600 hover:to-blue-700 transition shadow-md"
              >
                All Bikes
              </button>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Search size={16} className="inline mr-2" />
                  Search by Name or Model
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="e.g., Yamaha YZF"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Brand Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bike Brand
                </label>
                <select
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="">All Brands</option>
                  {BIKE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Price Range (BDT)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Posted Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 flex flex-col">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow-md"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {bikes.length === 0 ? (
              <div className="text-center py-16">
                <Bike size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-xl text-slate-500">No bikes found</p>
                <p className="text-sm text-slate-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                  {bikes.map((bike) => (
                    <VehicleCard key={bike._id} vehicle={bike} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition shadow-lg"
                    >
                      {loadingMore ? "Loading..." : "Load More Bikes"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
