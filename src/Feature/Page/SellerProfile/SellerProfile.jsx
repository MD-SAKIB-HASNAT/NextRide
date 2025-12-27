import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  User as UserIcon,
  MessageCircle,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import VehicleCard from "../../../Components/VehicleCard";

export default function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/user/${sellerId}`);
        setSeller(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load seller profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchSellerVehicles = async () => {
      try {
        setVehiclesLoading(true);
        const { data } = await apiClient.get(`/seller/${sellerId}?limit=20`);
        setVehicles(data.data || []);
      } catch (err) {
        console.error("Failed to load seller vehicles:", err);
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchSellerProfile();
    fetchSellerVehicles();
  }, [sellerId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Seller Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-sky-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Seller Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-green-100 to-blue-200"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white overflow-hidden">
                  {seller.profilePhoto ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${seller.profilePhoto}`}
                      alt={seller.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    seller.name?.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow mt-4 md:mt-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{seller.name}</h1>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="capitalize text-sm font-medium px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                        {seller.role}
                      </span>
                      {seller.emailVerified ? (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle size={16} />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-slate-400">
                          <XCircle size={16} />
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Message Button */}
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition transform">
                    <MessageCircle size={20} />
                    Send Message
                  </button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {seller.email && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail size={20} className="text-sky-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-slate-700 break-all">{seller.email}</p>
                      </div>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone size={20} className="text-sky-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                        <a
                          href={`tel:${seller.phone}`}
                          className="text-sm text-sky-600 font-medium hover:text-sky-700"
                        >
                          {seller.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {seller.createdAt && (
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Calendar size={20} className="text-sky-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Member Since</p>
                        <p className="text-sm text-slate-700">{formatDate(seller.createdAt)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-6 flex items-center gap-2">
                  <Shield size={20} className="text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Account Status:{" "}
                    <span
                      className={`font-semibold capitalize ${
                        seller.status === "active" ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {seller.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller's Listings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Listings by {seller.name?.split(" ")[0]}
          </h2>

          {vehiclesLoading ? (
            <div className="py-12 text-center">
              <LoadingSpinner />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="py-16 text-center">
              <UserIcon size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-xl text-slate-500">No listings yet</p>
              <p className="text-sm text-slate-400 mt-2">
                This seller hasn't posted any vehicles
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
