import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password email:", email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Forgot Password
      </h2>

      <p className="text-sm text-slate-600 mb-6">
        Enter your email address. We’ll send you a link to reset your password.
      </p>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-full bg-sky-600 py-2.5 text-white font-semibold hover:bg-sky-700 transition"
      >
        Send Reset Link
      </button>

      {/* Back to login */}
      <p className="text-sm text-center text-slate-600 mt-4">
        Remember your password?{" "}
        <a href="/login" className="text-sky-600 font-medium">
          Back to Login
        </a>
      </p>
    </form>
  );
}
