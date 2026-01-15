import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, Bike, MapPin, Calendar, Trash2 } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function MyRentListings() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchMyRentVehicles();
  }, []);

  const fetchMyRentVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/rent/my-listings");
      setVehicles(data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rent vehicles");
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (id, newAvailability) => {
    try {
      setUpdatingId(id);
      await apiClient.patch(`/rent/${id}/availability`, { availability: newAvailability });
      
      // Update local state
      setVehicles(vehicles.map(v => 
        v._id === id ? { ...v, availability: newAvailability } : v
      ));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update availability");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteVehicle = async (id, vehicleModel) => {
    if (!confirm(`Are you sure you want to delete "${vehicleModel}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setUpdatingId(id);
      await apiClient.delete(`/rent/${id}`);
      
      // Remove from local state
      setVehicles(vehicles.filter(v => v._id !== id));
      alert("Vehicle deleted successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete vehicle");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-slate-600 hover:text-sky-600 mb-3 transition"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-900">My Rent Vehicles</h1>
            <p className="text-slate-500 mt-2">Manage your rental listings and availability</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Car size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Rent Vehicles</h3>
            <p className="text-slate-500 mb-4">You haven't added any vehicles for rent yet.</p>
            <button
              onClick={() => navigate("/rent/add")}
              className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-slate-200 overflow-hidden relative">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${vehicle.images[0]}`}
                      alt={vehicle.vehicleModel}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      {vehicle.vehicleType === "car" ? <Car size={48} /> : <Bike size={48} />}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        vehicle.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : vehicle.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {vehicle.vehicleModel}
                    </h3>
                    <p className="text-sm text-slate-600 capitalize flex items-center gap-1">
                      {vehicle.vehicleType === "car" ? <Car size={14} /> : <Bike size={14} />}
                      {vehicle.vehicleType}
                    </p>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-sky-500" />
                      {vehicle.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-500 font-semibold">tk.</span>
                      {vehicle.pricePerDay}/day
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Availability Status:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateAvailability(vehicle._id, "available")}
                        disabled={updatingId === vehicle._id || vehicle.availability === "available"}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                          vehicle.availability === "available"
                            ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        } disabled:opacity-50`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() => updateAvailability(vehicle._id, "rented")}
                        disabled={updatingId === vehicle._id || vehicle.availability === "rented"}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                          vehicle.availability === "rented"
                            ? "bg-amber-100 text-amber-700 border-2 border-amber-500"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        } disabled:opacity-50`}
                      >
                        Rented
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/rent/vehicle/${vehicle._id}`)}
                    className="w-full mt-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition font-medium text-sm"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => deleteVehicle(vehicle._id, vehicle.vehicleModel)}
                    disabled={updatingId === vehicle._id}
                    className="w-full mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Delete Vehicle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
