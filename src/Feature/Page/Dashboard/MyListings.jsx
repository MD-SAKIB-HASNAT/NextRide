import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Bike, Car, CheckCircle, Filter, MapPin, Tag, X } from "lucide-react";

const mockListings = [
  {
    id: "B-201",
    title: "Yamaha R15 V4",
    type: "bike",
    status: "active",
    paymentStatus: "paid",
    price: 250000,
    posted: "Jan 05",
    location: "Dhaka",
    views: 134,
  },
  {
    id: "B-225",
    title: "TVS Apache RTR 4V",
    type: "bike",
    status: "pending",
    paymentStatus: "pending",
    price: 185000,
    posted: "Jan 12",
    location: "Chattogram",
    views: 42,
  },
  {
    id: "C-014",
    title: "Toyota Axio 2018",
    type: "car",
    status: "active",
    paymentStatus: "paid",
    price: 1850000,
    posted: "Dec 28",
    location: "Dhaka",
    views: 89,
  },
  {
    id: "C-077",
    title: "Honda Vezel 2017",
    type: "car",
    status: "review",
    paymentStatus: "pending",
    price: 2100000,
    posted: "Jan 02",
    location: "Sylhet",
    views: 51,
  },
];

const badgeClass = (status) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "review") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
};

export default function MyListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get("type") || "all";
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredListings = useMemo(() => {
    return mockListings.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesPayment =
        paymentFilter === "all" || item.paymentStatus === paymentFilter;
      return matchesType && matchesPayment;
    });
  }, [typeFilter, paymentFilter]);

  const updateType = (value) => {
    setTypeFilter(value);
    if (value === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", value);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Listings</p>
            <h1 className="text-3xl font-bold text-slate-900">My Vehicle Posts</h1>
            <p className="text-sm text-slate-500">Filter by type and payment status</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:-translate-y-0.5 transition"
          >
            <X size={16} /> Back
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Filter size={16} className="text-slate-500" />
            <select
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              value={typeFilter}
              onChange={(e) => updateType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
            </select>
          </div>
          <select
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">Any payment</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{item.id}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} className="text-blue-500" /> {item.location}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass(item.status)}`}>
                  {item.status}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                  <Tag size={14} className="text-amber-500" /> ৳ {item.price.toLocaleString()}
                </span>
                <span className="text-slate-500">Views: {item.views}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${
                  item.paymentStatus === "paid"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}>
                  <CheckCircle size={14} /> {item.paymentStatus === "paid" ? "Payment received" : "Payment pending"}
                </span>
                <span className="text-slate-500">Posted {item.posted}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="mt-8 text-center text-slate-500">No listings found for this filter.</div>
        )}
      </div>
    </div>
  );
}
