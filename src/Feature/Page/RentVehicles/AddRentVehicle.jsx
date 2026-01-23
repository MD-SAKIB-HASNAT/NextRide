import React, { useState } from "react";
import { Upload, ArrowLeft, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosInstance";

export default function AddRentVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleModel: "",
    vehicleType: "car",
    address: "",
    contactNumber: "",
    email: "",
    pricePerDay: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validate at least one image is uploaded
    if (images.length === 0) {
      setError("Please upload at least one image of the vehicle");
      setSubmitting(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("vehicleModel", formData.vehicleModel);
      formPayload.append("vehicleType", formData.vehicleType);
      formPayload.append("address", formData.address);
      formPayload.append("contactNumber", formData.contactNumber);
      if (formData.email) formPayload.append("email", formData.email);
      formPayload.append("pricePerDay", formData.pricePerDay);
      if (formData.description) formPayload.append("description", formData.description);

      images.forEach((img) => formPayload.append("images", img));

      await apiClient.post("/rent", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add rent vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-50 via-white to-white p-6">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Add Rent Vehicle</h1>
            <p className="text-slate-500 mt-1">Provide details to list your vehicle for rent.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Success Dialog */}
        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
              <p className="text-slate-600 mb-2">Your vehicle has been submitted successfully.</p>
              <p className="text-slate-500 text-sm mb-6">
                Please wait for admin approval. We'll review your vehicle and notify you shortly.
              </p>
              <button
                onClick={() => navigate("/rent")}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
              >
                Go to Rent Vehicles
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Model *</label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="e.g., Toyota Camry 2022"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price per Day ($) *</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="e.g., 50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="e.g., Dhaka, Bangladesh"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="e.g., +8801234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="e.g., owner@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
              placeholder="Describe the vehicle..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Images (required, at least 1, max 5) *</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <Upload size={24} className="mx-auto text-slate-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="text-sm text-slate-600"
              />
              {images.length > 0 && (
                <p className="text-sm text-slate-600 mt-2">{images.length} file(s) selected</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
