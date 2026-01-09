import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const tranId = params.get("tran_id");
  const amount = params.get("amount");

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful</h1>
        <p className="mt-2 text-slate-700">Thank you! Your payment has been received.</p>
        <div className="mt-4 text-sm text-slate-600">
          {tranId && <p>Transaction ID: <span className="font-mono">{tranId}</span></p>}
          {amount && <p>Amount: {amount} BDT</p>}
        </div>
        <Link to="/" className="mt-6 inline-block px-4 py-2 rounded bg-green-600 text-white">Go Home</Link>
      </div>
    </div>
  );
}
