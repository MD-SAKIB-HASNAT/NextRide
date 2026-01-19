import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Download, 
  Filter, 
  X, 
  Check, 
  Clock, 
  AlertCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    fetchPaymentHistory();
  }, [filterStatus, navigate]);

  const fetchPaymentHistory = async (cursor) => {
    try {
      setLoading(!cursor);
      const params = new URLSearchParams({ limit: "10" });
      if (cursor) {
        params.append("cursor", cursor);
      }
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const response = await apiClient.get(`/payment/history?${params}`);
      const responseData = response.data;

      const items = responseData?.data || responseData || [];
      const pageInfo = responseData?.pageInfo || { hasNextPage: false, nextCursor: null };

      if (cursor) {
        setPayments(prev => [...prev, ...items]);
      } else {
        setPayments(items);
        
        // Calculate stats
        const total = items.length;
        const completed = items.filter(p => p.status === 'success').length;
        const amount = items.reduce((sum, p) => sum + (p.amount || 0), 0);
        
        setStats({
          totalPayments: total,
          totalAmount: amount,
          completedPayments: completed,
        });
      }

      setNextCursor(pageInfo.nextCursor || null);
      setHasMore(!!pageInfo.hasNextPage);
      setError("");
    } catch (err) {
      console.error("Error fetching payment history:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load payment history";
      setError(errorMsg);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    await fetchPaymentHistory(nextCursor);
  };

  const getStatusBadgeClass = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    if (normalizedStatus === 'success') 
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (normalizedStatus === 'pending' || normalizedStatus === 'initiated') 
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (normalizedStatus === 'failed') 
      return "bg-red-100 text-red-700 border-red-200";
    if (normalizedStatus === 'cancelled')
      return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    if (normalizedStatus === 'completed' || normalizedStatus === 'success') 
      return <Check size={16} />;
    if (normalizedStatus === 'pending') 
      return <Clock size={16} />;
    if (normalizedStatus === 'failed') 
      return <AlertCircle size={16} />;
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Transactions</p>
            <h1 className="text-4xl font-bold text-slate-900">Payment History</h1>
            <p className="text-sm text-slate-500">View all your payment transactions and receipts</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:-translate-y-0.5 transition"
          >
            <X size={16} /> Back
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Total Transactions</p>
              <CreditCard size={20} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.totalPayments}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Completed Payments</p>
              <Check size={20} className="text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{stats.completedPayments}</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">Total Amount Paid</p>
              <DollarSign size={20} className="text-amber-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">৳ {stats.totalAmount.toLocaleString()}</h3>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300"
            }`}
          >
            <Filter size={14} className="inline mr-2" /> All
          </button>
          <button
            onClick={() => setFilterStatus("success")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "success"
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            <Check size={14} className="inline mr-2" /> Completed
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              filterStatus === "pending"
                ? "bg-amber-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:border-amber-300"
            }`}
          >
            <Clock size={14} className="inline mr-2" /> Pending
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Payment List */}
        <div className="space-y-3">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Payment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {payment.vehicleId?.make} {payment.vehicleId?.modelName} - Platform Fee
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Amount</p>
                      <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                        ৳ {(payment.amount || 0).toLocaleString()}
                      </h4>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap ${getStatusBadgeClass(
                      payment.status
                    )}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">
                        {payment.status || "Pending"}
                      </span>
                    </div>

                    {(payment.status === 'success') && (
                      <button
                        onClick={() => navigate(`/payment-receipt/${payment._id}`)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Transaction ID</p>
                      <p className="font-mono text-slate-900">{payment._id?.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Vehicle Type</p>
                      <p className="capitalize text-slate-900">{payment.vehicleId?.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Payment Method</p>
                      <p className="capitalize text-slate-900">{payment.paymentMethod || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Reference</p>
                      <p className="text-slate-900">{payment.transactionId || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-semibold text-slate-900 mb-1">No Payments Found</p>
              <p className="text-sm text-slate-500">
                {filterStatus !== "all" 
                  ? `No ${filterStatus} payments yet. Try a different filter.`
                  : "You haven't made any payments yet."}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition inline-flex items-center gap-2"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
