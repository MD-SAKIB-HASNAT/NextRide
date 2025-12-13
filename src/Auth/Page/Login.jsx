import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // later you will call API here
    console.log("Login data:", form);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 p-2">
    <motion.form
        initial={{ opacity: 0, x: -120 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-2xl shadow-2xl p-4"
      >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        Login
      </h2>
      <p className="text-sm text-slate-600 mb-6">
        Login to your NextRide account
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Forgot password */}
      <div className="flex justify-end mb-6">
        <a
          href="/forgot-password"
          className="text-sm text-sky-600 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full rounded-full bg-sky-600 py-2.5 text-white font-semibold hover:bg-sky-700 transition"
      >
        Login
      </button>

      {/* Register link */}
      <p className="text-sm text-center text-slate-600 mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-sky-600 font-medium">
          Create account
        </a>
      </p>
    </motion.form>
    </div>
  );
}
