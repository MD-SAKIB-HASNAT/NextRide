import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import apiClient from "../../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await apiClient.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100"
      >
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-4">
            <LogIn className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Login to your NextRide account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-focus-within:text-sky-600 transition" size={18} />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-focus-within:text-sky-600 transition" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-3 text-white font-semibold shadow-lg hover:shadow-xl transition duration-200 ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Register Link */}
        <p className="text-sm text-center mt-6 text-slate-600">
          Don't have an account?{" "}
          <a href="/register" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition">
            Register here
          </a>
        </p>

        {/* Forgot Password Link */}
        <p className="text-sm text-center mt-3 text-slate-600">
          <a href="/forgot-password" className="text-slate-500 hover:text-sky-600 hover:underline transition">
            Forgot password?
          </a>
        </p>
      </motion.form>
    </div>
  );
}
