import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, Smartphone, Wallet, ArrowLeft } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const methods = useMemo(() => ([
    {
      key: "sslcommerz",
      name: "SSLCommerz",
      description: "Pay securely with cards and bank channels",
      icon: CreditCard,
      color: "text-sky-600",
    },
    {
      key: "bkash",
      name: "bKash",
      description: "Mobile wallet payment via bKash",
      icon: Smartphone,
      color: "text-pink-600",
    },
    {
      key: "nagad",
      name: "Nagad",
      description: "Mobile wallet payment via Nagad",
      icon: Smartphone,
      color: "text-orange-600",
    },
    {
      key: "manual",
      name: "Other Methods",
      description: "Bank transfer or cash at office",
      icon: Wallet,
      color: "text-emerald-600",
    },
  ]), []);

  const startPayment = (method) => {
    // Placeholder: integrate backend initiation per method
    // For now, route to a method-specific screen
    alert(`Starting payment for listing ${id} via ${method}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
          <h1 className="text-2xl font-bold text-slate-900">Choose Payment Method</h1>
          <p className="text-sm text-slate-600 mt-1">Listing ID: {id}</p>

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
