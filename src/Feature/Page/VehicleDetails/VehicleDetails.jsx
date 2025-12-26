import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Car,
  Bike,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Phone,
  User,
  MessageCircle,
  ArrowLeft,
  Check,
  X,
  Settings,
  Tag,
  FileText,
  Shield,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../Components/LoadingSpiner";

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/vehicles/${id}`);
        setVehicle(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <X size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vehicle Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCar = vehicle.vehicleType === "car";
  const Icon = isCar ? Car : Bike;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-sky-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${vehicle.images[selectedImage]}`}
                    alt={`${vehicle.make} ${vehicle.modelName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon size={96} className="text-slate-400" />
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-sky-500/90 backdrop-blur text-sm font-semibold text-white shadow capitalize flex items-center gap-2">
                  <Icon size={16} />
                  {vehicle.vehicleType}
                </div>
              </div>

              {/* Thumbnail Images */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === index
                          ? "border-sky-500"
                          : "border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {vehicle.make} {vehicle.modelName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-sky-500" />
                      {vehicle.year}
                    </span>
                    {vehicle.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={16} className="text-sky-500" />
                        {vehicle.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-sky-600">
                    ৳ {vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Gauge size={24} className="mx-auto text-sky-500 mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Mileage</p>
                  <p className="font-semibold text-slate-900">
                    {vehicle.mileage?.toLocaleString()} km
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Fuel size={24} className="mx-auto text-sky-500 mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Fuel Type</p>
                  <p className="font-semibold text-slate-900 capitalize">{vehicle.fuelType}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Settings size={24} className="mx-auto text-sky-500 mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Condition</p>
                  <p className="font-semibold text-slate-900 capitalize">{vehicle.condition}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Shield size={24} className="mx-auto text-sky-500 mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <p className="font-semibold text-slate-900 capitalize">{vehicle.status}</p>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-sky-500" />
                  Description
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Vehicle Type</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {vehicle.vehicleType}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Payment Status</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {vehicle.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Posted On</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(vehicle.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(vehicle.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Seller Card */}
              {vehicle.userId && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Seller Information</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {vehicle.userId.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{vehicle.userId.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{vehicle.userId.role}</p>
                    </div>
                  </div>

                  {vehicle.userId.email && (
                    <div className="mb-3 pb-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-sm text-slate-700">{vehicle.userId.email}</p>
                    </div>
                  )}

                  {vehicle.phone && (
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Phone</p>
                      <a
                        href={`tel:${vehicle.phone}`}
                        className="text-sm text-sky-600 font-medium hover:text-sky-700 flex items-center gap-2"
                      >
                        <Phone size={14} />
                        {vehicle.phone}
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/seller/${vehicle.userId._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-blue-700 transition shadow-md"
                    >
                      <User size={18} />
                      View Seller Profile
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-sky-500 text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition">
                      <MessageCircle size={18} />
                      Send Message
                    </button>
                  </div>
                </div>
              )}

              {/* Safety Tips */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-6 border border-amber-200">
                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Shield size={20} />
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <span>Meet seller at a safe public location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <span>Check the item before purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <span>Pay only after collecting item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <span>Verify vehicle documents carefully</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
