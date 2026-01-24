import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/axiosInstance";

export default function UsedCar() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await apiClient.get("/vehicles/public/filtered-listings", {
          params: {
            vehicleType: "car",
            status:"active",
            limit: 6,
          },
        });
        setCars(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleCarClick = (carId) => {
    navigate(`/vehicles/${carId}`);
  };

  const handleViewAll = () => {
    navigate('/cars');
  };

  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Car</h2>

          <button
            onClick={handleViewAll}
            className="rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                Loading cars...
              </div>
            ) : cars.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">
                No cars available
              </div>
            ) : (
              cars.map((car) => (
                <div
                  key={car._id}
                  onClick={() => handleCarClick(car._id)}
                  className="bg-white rounded-xl border border-blue-200 shadow-lg p-4 cursor-pointer hover:shadow-blue-300/50 hover:shadow-xl transition-all duration-300"
                >
                  <span className="inline-block mb-2 rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">
                    Sell
                  </span>

                  <img
                    src={
                      car.images && car.images.length > 0
                        ? `${import.meta.env.VITE_API_URL}/uploads/${car.images[0]}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={car.title}
                    className="w-full h-32 object-cover mb-4 rounded"
                  />

                  <h4 className="text-sm font-medium text-slate-900 mb-2">
                    {car.title}
                  </h4>

                  <p className="text-xs text-slate-500 mb-1">Get upto</p>

                  <p className="text-lg font-semibold text-slate-800">
                    ৳ {car.price?.toLocaleString() || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="md:flex md:items-center lg:flex-col lg:col-span-1 bg-gradient-to-b from-sky-100 to-white rounded-xl overflow-hidden shadow-md border border-blue-300 p-6">
            <img
              src="/logo-bg-remove.png"
              alt="Sell Car"
              className="object-cover mb-4"
            />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                গাড়ি বিক্রি করুন
              </h3>
              <p className="text-lg font-semibold text-sky-600 mb-4">
                সেরা দামে
              </p>

              <a
                href="/sell"
                className="inline-block rounded-full border border-sky-600 px-6 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50"
              >
                SELL NOW
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
