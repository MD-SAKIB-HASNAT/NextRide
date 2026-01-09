import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-yellow-700">Payment Cancelled</h1>
        <p className="mt-2 text-slate-700">You cancelled the payment.</p>
        <Link to="/" className="mt-6 inline-block px-4 py-2 rounded bg-yellow-600 text-white">Go Home</Link>
      </div>
    </div>
  );
}
