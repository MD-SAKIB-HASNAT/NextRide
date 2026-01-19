import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/axiosInstance";

export default function UsedBike() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await apiClient.get("/vehicles/public/filtered-listings", {
          params: {
            vehicleType: "bike",
            limit: 6,
          },
        });
        console.log(response.data.data);
        setBikes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching bikes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const handleBikeClick = (bikeId) => {
    navigate(`/vehicles/${bikeId}`);
  };

  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Motorcycle</h2>

          <button className="rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="md:flex md:items-center lg:flex-col lg:col-span-1 bg-gradient-to-b from-sky-100 to-white rounded-xl overflow-hidden shadow-md border border-blue-300 p-6">
            <img
              src="/logo-bg-remove.png"
              alt="Sell Bike"
              className="object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                মোটরসাইকেল বিক্রি করুন
              </h3>
              <p className="text-lg font-semibold text-sky-600 mb-4">
                সেরা দামে
              </p>

              <button className="rounded-full border border-sky-600 px-6 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50 cursor-pointer">
                <a href="/sell">SELL NOW</a>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                Loading bikes...
              </div>
            ) : bikes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                No bikes available
              </div>
            ) : (
              bikes.map((bike) => (
                <div
                  key={bike._id}
                  onClick={() => handleBikeClick(bike._id)}
                  className="bg-white rounded-xl border border-blue-200 shadow-lg p-4 cursor-pointer hover:shadow-blue-300/50 hover:shadow-xl transition-all duration-300"
                >
                  <span className="inline-block mb-2 rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">
                    Sell
                  </span>

                  <img
                    src={
                      bike.images && bike.images.length > 0
                        ? `${import.meta.env.VITE_API_URL}/uploads/${bike.images[0]}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={bike.title}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />

                  <h4 className="text-sm font-medium text-slate-900 mb-2">
                    {bike.title}
                  </h4>

                  <p className="text-xs text-slate-500 mb-1">Get upto</p>

                  <p className="text-lg font-semibold text-slate-800">
                    ৳ {bike.price?.toLocaleString() || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
