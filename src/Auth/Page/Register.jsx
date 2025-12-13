import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Register data:", form);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 p-2">
      <motion.form
        initial={{ opacity: 0, x: -180 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-2xl shadow-2xl p-4"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Join us and start buying, selling, or managing vehicles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                name="phone"
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Register As</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="user">User</option>
              <option value="organization">Organization</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2 focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2 focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {strength.label && (
          <div className="mb-4">
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color}`}
                style={{
                  width:
                    strength.label === "Weak"
                      ? "33%"
                      : strength.label === "Medium"
                      ? "66%"
                      : "100%",
                }}
              />
            </div>
            <p className="text-xs mt-1 text-slate-600">
              Password strength:{" "}
              <span className="font-semibold">{strength.label}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 py-3 text-white font-semibold hover:bg-sky-700 transition"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-5 text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-sky-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </motion.form>
    </div>
  );
}
