import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function RentVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, nextCursor: null });
  const [filters, setFilters] = useState({ vehicleType: "", availability: "", search: "" });
  
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async (cursor = null) => {
    try {
      if (cursor) setLoadingMore(true);
      else setLoading(true);
      setError("");

      const { data } = await apiClient.get("/rent/public", {
        params: {
          cursor,
          vehicleType: filters.vehicleType || undefined,
          availability: filters.availability || undefined,
          search: filters.search || undefined,
        },
      });

      console.log(data);

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


  if (loading && !vehicles.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-50 via-white to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Rent Vehicles</h1>
            <p className="text-slate-500 mt-2">Find and list vehicles available for rent</p>
          </div>
          {user?.role === "organization" && (
            <button
              onClick={() => navigate("/rent/add")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <div className="flex items-center border border-slate-200 rounded-lg bg-white px-3 py-2 text-sm">
            <Search size={14} className="text-slate-500 mr-2" />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search model, address..."
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

          <button
            onClick={() => fetchVehicles()}
            className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition"
              onClick={() => navigate(`/rent/vehicle/${vehicle._id}`)}
              role="button"
            >
              <div className="h-48 bg-slate-200 overflow-hidden">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${vehicle.images[0]}`}
                    alt={vehicle.vehicleModel}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{vehicle.vehicleModel}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                      vehicle.availability === "available"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {vehicle.availability}
                  </span>
                </div>

                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <span className="font-medium">Type:</span> {vehicle.vehicleType}
                </p>

                <p className="text-sm text-slate-600">
                  <span className="font-medium">Location:</span> {vehicle.address}
                </p>

                <p className="text-sm text-slate-600">
                  <span className="font-medium">Contact:</span> {vehicle.contactNumber}
                </p>

                <p className="text-xl font-bold text-slate-900 mt-3">
                  tk.{vehicle.pricePerDay} <span className="text-sm font-normal text-slate-500">/day</span>
                </p>

                {vehicle.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{vehicle.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {vehicles.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-500">
            No rent vehicles found. Add one to get started!
          </div>
        )}

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
    </div>
  );
}
