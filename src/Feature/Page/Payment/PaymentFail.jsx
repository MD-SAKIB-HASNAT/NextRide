import React from "react";
import { Link } from "react-router-dom";

export default function PaymentFail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
        <p className="mt-2 text-slate-700">Something went wrong with the payment.</p>
        <Link to="/" className="mt-6 inline-block px-4 py-2 rounded bg-red-600 text-white">Go Home</Link>
      </div>
    </div>
  );
}
