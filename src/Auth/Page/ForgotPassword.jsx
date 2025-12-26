import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import apiClient from "../../api/axiosInstance";

export default function ForgotPassword() {
  const [step, setStep] = useState("request"); // request -> otp -> reset -> success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSuccess("OTP sent to your email. Please check your inbox.");
      setStep("otp");
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setSuccess("OTP verified. Please set your new password.");
    setStep("reset");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword: form.newPassword,
      });
      setSuccess("Password reset successful. You can now log in.");
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const renderAlert = () => (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
        >
          {success}
        </motion.div>
      )}
    </>
  );

  // Step: request email
  if (step === "request") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleRequest}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100"
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-4">
              <Mail className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Enter your email and we'll send an OTP to reset your password.
            </p>
          </div>

          {renderAlert()}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 group-focus-within:text-sky-600 transition" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              />
            </div>
          </div>

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
            {loading ? "Sending OTP..." : "Send OTP"}
          </motion.button>

          <p className="text-sm text-center mt-6 text-slate-600">
            Remember your password?{" "}
            <a href="/login" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition">
              Back to Login
            </a>
          </p>
        </motion.form>
      </div>
    );
  }

  // Step: verify OTP
  if (step === "otp") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleVerifyOtp}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100"
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-4">
              <Mail className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify OTP</h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Enter the 6-digit OTP sent to <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          {renderAlert()}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              placeholder="000000"
              className="w-full text-center text-3xl font-bold tracking-widest rounded-xl border-2 border-slate-300 py-4 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">
              {otp.length}/6 digits entered
            </p>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={otp.length !== 6}
            className={`w-full rounded-xl py-3 text-white font-semibold shadow-lg transition duration-200 ${
              otp.length !== 6
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 hover:shadow-xl"
            }`}
          >
            Verify OTP
          </motion.button>

          <button
            type="button"
            onClick={() => setStep("request")}
            className="w-full mt-4 text-sm text-slate-600 hover:text-slate-700 transition"
          >
            Back to Email
          </button>
        </motion.form>
      </div>
    );
  }

  // Step: reset password
  if (step === "reset") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleReset}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-sky-100"
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-4">
              <Lock className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Set New Password</h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Enter your new password below.
            </p>
          </div>

          {renderAlert()}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              required
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
          </div>

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
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </motion.form>
      </div>
    );
  }

  // Step: success
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-green-100 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
          <span className="text-white text-2xl font-bold">✓</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Password Reset</h2>
        <p className="text-base text-slate-500 leading-relaxed mb-8">
          Your password has been reset successfully. You can now log in.
        </p>

        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition"
        >
          Go to Login
        </a>
      </motion.div>
    </div>
  );
}
