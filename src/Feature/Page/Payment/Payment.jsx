import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, Smartphone, Wallet, ArrowLeft } from "lucide-react";
import apiClient from "../../../api/axiosInstance";

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicle and user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle by ID
        const vehicleRes = await apiClient.get(`/vehicles/${id}`);
        setVehicle(vehicleRes.data);

        // Get user from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setError("User not found. Please login.");
          navigate("/login");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const methods = useMemo(() => ([
    {
      key: "sslcommerz",
      name: "SSLCommerz",
      description: "Pay securely with cards and bank channels",
      icon: CreditCard,
      color: "text-sky-600",
    },
   
  ]), []);

  const startPayment = async (method) => {
    try {
      if (!vehicle || !user) {
        alert("Unable to fetch listing or user details. Please refresh and try again.");
        return;
      }

      if (method !== "sslcommerz") {
        alert("This method is not available yet. Using SSLCommerz.");
      }

      const platformFee = Number(vehicle.platformFee || 0);
      if (platformFee <= 0) {
        alert("No payment is required for this listing. Please wait for admin approval.");
        navigate('/dashboard');
        return;
      }

      const payload = {
        referenceId: vehicle._id,
        amount: platformFee,
        currency: "BDT",
        product_name: `${vehicle.make} ${vehicle.modelName}`,
        product_category: vehicle.vehicleType,
        cus_name: user.name,
        cus_email: user.email,
        cus_phone: user.phone,
        cus_add1: vehicle.location ,
        cus_country: "Bangladesh",
      };

      const res = await apiClient.post("/payment/initiate", payload);
      const url = res?.data?.url || res?.data?.gatewayResponse?.GatewayPageURL;
      if (url) {
        window.location.href = url;
      } else {
        console.error("Unexpected initiate response:", res?.data);
        alert("Unable to start payment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Payment initiation failed. Please try again.";
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-slate-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-700">Error</h1>
          <p className="mt-2 text-slate-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 rounded bg-red-600 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Choose Payment Method</h1>
          <p className="text-sm text-slate-600 mt-1">
            {vehicle && (
              <>
                Vehicle: {vehicle.make} {vehicle.modelName} | Price: {vehicle.price} BDT 
                {vehicle.platformFee && ` | Platform Fee: ${vehicle.platformFee} BDT`}
              </>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.key} className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Icon size={24} className={m.color} />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{m.name}</h3>
                      <p className="text-sm text-slate-600">{m.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => startPayment(m.key)}
                      className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition"
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
