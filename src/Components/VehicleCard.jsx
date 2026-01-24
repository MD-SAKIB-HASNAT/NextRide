import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Bike, MapPin, Calendar, Gauge, Fuel, Tag, Phone, User } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isCar = vehicle.vehicleType === "car";
  const Icon = isCar ? Car : Bike;

  return (
    <div className="rounded-lg w-full h-full border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-linear-to-br from-slate-100 to-slate-200">
        {vehicle.images && vehicle.images[0] ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${vehicle.images[0]}`}
            alt={`${vehicle.make} ${vehicle.modelName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon size={48} className="text-slate-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 shadow">
          {vehicle.year}
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-sky-500/90 backdrop-blur text-xs font-semibold text-white shadow capitalize">
          {vehicle.vehicleType}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          {vehicle.make} {vehicle.modelName}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-lg font-bold text-sky-600">
            ৳ {vehicle.price.toLocaleString()}
          </span>
        </div>

        <div className="space-y-1 mb-3">
          {vehicle.location && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin size={12} className="text-sky-500 shrink-0" />
              <span className="truncate">{vehicle.location}</span>
            </div>
          )}
          {vehicle.mileage && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Gauge size={12} className="text-sky-500 shrink-0" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
          )}
          {vehicle.fuelType && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Fuel size={12} className="text-sky-500 shrink-0" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Calendar size={12} className="text-sky-500 shrink-0" />
            <span>{formatDate(vehicle.createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/vehicles/${vehicle._id}`)}
          className="w-full px-3 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
