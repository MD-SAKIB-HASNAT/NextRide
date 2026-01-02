import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, ArrowLeft, Loader2 } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function RentVehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await apiClient.get(`/rent/${id}`);
        setVehicle(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );

  if (!vehicle) return null;

  const mainImage = vehicle.images?.[0];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-50 via-white to-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-slate-900 text-white">
            {vehicle.availability || "available"}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-64 lg:h-80 bg-slate-200 rounded-xl overflow-hidden">
                {mainImage ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${mainImage}`}
                    alt={vehicle.vehicleModel}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                    No image available
                  </div>
                )}
              </div>
              {vehicle.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="h-20 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{vehicle.vehicleModel}</h1>
              <p className="text-sm text-slate-600">Type: {vehicle.vehicleType}</p>
              <p className="text-2xl font-bold text-slate-900">
                ${vehicle.pricePerDay}
                <span className="text-sm font-normal text-slate-500"> / day</span>
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {vehicle.description || "No description provided."}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <MapPin size={16} className="text-sky-600" />
                <span>{vehicle.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Phone size={16} className="text-sky-600" />
                <span>{vehicle.contactNumber}</span>
              </div>
              {vehicle.email && (
                <p className="text-sm text-slate-700">Email: {vehicle.email}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  vehicle.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : vehicle.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {vehicle.status}
                </span>
                <span className="text-xs text-slate-500">
                  Listed on {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
