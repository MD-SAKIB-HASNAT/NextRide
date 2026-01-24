import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../api/axiosInstance";

export default function SuggestedRentVehicle() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedVehicles();
  }, []);

  const fetchSuggestedVehicles = async () => {
    try {
      const response = await apiClient.get('/rent/public/suggested');
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch suggested rent vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/rent/vehicle/${id}`);
  };

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/rent');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1622185135505-2d795003994a';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <section className="w-full bg-slate-50 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Suggested Rent Vehicles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-6 bg-slate-300 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-slate-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">
          Suggested Rent Vehicles
        </h2>

        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No rent vehicles available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.vehicleModel}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {item.availability === 'available' ? 'Available' : 'Rented'}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug min-h-10">
                      {item.vehicleModel}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-sky-600">
                        ৳ {item.pricePerDay}
                      </span>
                      <span className="text-sm text-slate-500">/ day</span>
                    </div>

                    <p className="text-sm text-slate-500">
                      Type:{" "}
                      <span className="font-medium text-slate-700 capitalize">
                        {item.vehicleType}
                      </span>
                    </p>

                    <p className="text-sm text-slate-500 line-clamp-2">
                      📍 {item.address}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleViewDetails(item._id)}
                        disabled={item.availability !== 'available'}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          item.availability !== 'available'
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "bg-sky-600 text-white hover:bg-sky-700"
                        }`}
                      >
                        View Details
                      </button>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={handleViewAll}
                className="rounded-full border border-sky-600 px-8 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition"
              >
                View All Rent Vehicles
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
