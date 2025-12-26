import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff, Upload, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosInstance";
import LoadingSpinner from "../../Components/LoadingSpiner";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form, otp, success
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    licenseFile: null,
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registrationData, setRegistrationData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    setForm({ ...form, licenseFile: e.target.files[0] });
    setError("");
  };

  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', form.role);
      
      // Add license file if organization and file exists
      if (form.role === 'organization' && form.licenseFile) {
        formData.append('licenseFile', form.licenseFile);
      }

      const { data } = await apiClient.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRegistrationData(data.user);
      setSuccess(`OTP sent to ${form.email}. Please check your email.`);
      setStep("otp");
      setOtp("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/auth/verify-email", {
        email: form.email,
        otp: otp,
      });

      setSuccess("Email verified successfully!");
      setStep("success");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      await apiClient.post("/auth/resend-otp", {
        email: form.email,
      });

      setSuccess("OTP resent successfully. Check your email.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Registration Form
  if (step === "form") {
    return (
      <div className=" w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-sky-100"
        >
          {/* Header Section */}
          <div className="mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-2 sm:mb-3">
              <User className="text-white" size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1.5">
              Create Account
            </h2>
            <p className="text-sm sm:text-base text-slate-500 px-2">
              Join us and start buying, selling, or managing vehicles
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
            >
              {success}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition" size={18} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  required
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  required
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  required
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Register As</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="user">👤 Individual User</option>
                <option value="organization">🏢 Organization</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  required
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

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 transition" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  required
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 sm:mb-4 p-2 sm:p-2.5 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Password Strength</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  strength.label === "Weak" ? "bg-red-100 text-red-700" :
                  strength.label === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {strength.label}
                </span>
              </div>
              <motion.div
                className={`h-2 w-full rounded-full overflow-hidden ${strength.color}`}
                initial={{ width: 0 }}
                animate={{
                  width: strength.label === "Weak" ? "33%" : 
                         strength.label === "Medium" ? "66%" : "100%"
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}

          {form.role === "organization" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 sm:mb-4"
            >
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                <FileText className="inline mr-2" size={14} />
                Organization License File
              </label>
              <label className="flex flex-col items-center justify-center w-full p-2.5 sm:p-3 border-2 border-dashed border-sky-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition bg-sky-50/50">
                <Upload className="text-sky-500 mb-2" size={20} />
                <span className="text-xs sm:text-sm font-medium text-slate-700 text-center px-2">
                  {form.licenseFile ? form.licenseFile.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX, JPG, PNG</span>
                <input
                  type="file"
                  name="licenseFile"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
              {form.licenseFile && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-600 mt-2 flex items-center"
                >
                  ✓ Selected: {form.licenseFile.name}
                </motion.p>
              )}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-lg hover:shadow-xl transition duration-200 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>

          <p className="text-xs sm:text-sm text-center mt-4 sm:mt-5 text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition">
              Login here
            </a>
          </p>
        </motion.form>
      </div>
    );
  }

  // OTP Verification
  if (step === "otp") {
    return (
      <div className=" w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4">
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleVerifyOtp}
          className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-sky-100"
        >
          {/* Header */}
          <div className="mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-2 sm:mb-3">
              <Mail className="text-white" size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
              Verify Email
            </h2>
            <p className="text-sm sm:text-base text-slate-500 px-2">
              We sent an OTP to <span className="font-semibold text-slate-700 break-all">{form.email}</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* OTP Input */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              maxLength="6"
              placeholder="000000"
              className="w-full text-center text-2xl sm:text-3xl font-bold tracking-widest rounded-xl border-2 border-slate-300 py-3 sm:py-4 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">
              {otp.length}/6 digits entered
            </p>
          </div>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full rounded-xl py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-lg transition duration-200 mb-3 sm:mb-4 ${
              loading || otp.length !== 6
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 hover:shadow-xl"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>

          {/* Resend OTP */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full text-xs sm:text-sm text-sky-600 font-medium hover:text-sky-700 underline transition disabled:text-slate-400"
          >
            {loading ? "Resending..." : "Didn't receive OTP? Resend"}
          </button>

          {/* Back to Form */}
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setError("");
              setSuccess("");
            }}
            className="w-full mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 hover:text-slate-700 transition"
          >
            Back to Registration
          </button>
        </motion.form>
      </div>
    );
  }

  // Success Screen
  if (step === "success") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-green-100 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-5"
          >
            <CheckCircle className="text-white" size={28} />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
            Email Verified!
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6 px-2">
            Your account has been successfully created and verified. Redirecting to login...
          </p>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }
}
