import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Bike,
  Car,
  ChevronRight,
  CreditCard,
  LogOut,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const mockPayments = [
    {
      id: "PMT-9821",
      vehicle: "Toyota Axio",
      type: "car",
      amount: 1250,
      status: "pending",
      method: "Card",
      date: "Jan 12, 2025",
    },
    {
      id: "PMT-9822",
      vehicle: "Yamaha R15 V4",
      type: "bike",
      amount: 680,
      status: "paid",
      method: "bKash",
      date: "Jan 10, 2025",
    },
    {
      id: "PMT-9823",
      vehicle: "Honda Vezel",
      type: "car",
      amount: 1490,
      status: "paid",
      method: "Nagad",
      date: "Dec 30, 2024",
    },
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    bikeCount: mockListings.filter((i) => i.type === "bike").length,
    carCount: mockListings.filter((i) => i.type === "car").length,
    pendingPayments: mockPayments.filter((p) => p.status === "pending").length,
    paidTotal: mockPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  const handleStatClick = (targetType) => {
    navigate(`/my-listings?type=${targetType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <aside className="lg:col-span-2 xl:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                {user.name?.slice(0, 1) || "N"}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Dashboard</p>
                <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <User size={18} className="text-blue-600" />
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone size={18} className="text-blue-600" />
                <span>{user.phone || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail size={18} className="text-blue-600" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Shield size={18} className="text-emerald-500" />
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">Verified</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 text-red-600 border border-red-100 px-4 py-3 font-semibold hover:bg-red-100 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </aside>

          <main className="lg:col-span-4 xl:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleStatClick("all")}
                className="text-left bg-gradient-to-br from-blue-700 to-slate-900 text-white rounded-3xl shadow-lg p-6 hover:-translate-y-0.5 transition transform"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-100">My posts</p>
                  <Activity size={22} />
                </div>
                <h3 className="text-3xl font-bold mt-2">{stats.bikeCount + stats.carCount}</h3>
                <p className="text-xs text-blue-200 mt-1">{stats.bikeCount} bikes • {stats.carCount} cars</p>
              </button>
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Pending payments</p>
                  <CreditCard size={22} className="text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingPayments}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <section className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Pending payments</h2>
                    <p className="text-sm text-slate-500">Complete payment to publish your posts</p>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                    {stats.pendingPayments} pending
                  </span>
                </div>

                <div className="space-y-3">
                  {mockPayments
                    .filter((p) => p.status === "pending")
                    .map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                        <div>
                          <p className="text-sm text-amber-700 font-semibold">{payment.vehicle}</p>
                          <p className="text-xs text-amber-600">{payment.type.toUpperCase()} • {payment.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">৳ {payment.amount}</p>
                          <button className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800">
                            Pay now <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              <section className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Payment details</h2>
                    <p className="text-sm text-slate-500">Recent transactions</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{payment.vehicle}</p>
                        <p className="text-xs text-slate-500">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">৳ {payment.amount}</p>
                        <span className={`text-xs font-semibold ${
                          payment.status === "paid"
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
