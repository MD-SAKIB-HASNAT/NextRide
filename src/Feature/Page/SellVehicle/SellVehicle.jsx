import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Upload,
  Gauge,
  DollarSign,
  Calendar,
  MapPin,
  Phone as PhoneIcon,
  CheckCircle,
  Image,
  Video,
  X,
} from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import LoadingSpinner from "../../../Components/LoadingSpiner";
import HashLoader from "react-spinners/HashLoader";

const brandsByType = {
  car: [
    "Toyota",
    "Honda",
    "Hyundai",
    "Suzuki",
    "Mahindra",
    "Maruti",
    "Ford",
    "BMW",
    "Mercedes",
    "Audi",
    "Kia",
    "Tata",
    "MG",
    "Nissan",
    "Chevrolet",
  ],
  bike: [
    "Honda",
    "Yamaha",
    "Bajaj",
    "Hero",
    "Royal Enfield",
    "KTM",
    "Suzuki",
    "TVS",
    "Harley-Davidson",
    "BMW",
    "Ducati",
    "Apache",
    "Pulsar",
    "Activa",
  ],
};

export default function SellVehicle() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    vehicleType: "car",
    make: "Toyota",
    modelName: "Corolla 2020",
    year: 2020,
    price: "1850000",
    mileage: "45000",
    fuelType: "petrol",
    condition: "excellent",
    description: "Well-maintained vehicle, full service history, no accident, single owner, all documents clear. Interior and exterior in excellent condition. AC working perfectly. All safety features functional.",
    location: "Dhaka",
    phone: "01712345678",
    images: [],
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (form.images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setForm({ ...form, images: [...form.images, ...files] });

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
    setError("");
  };

  const removeImage = (index) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
      if (file.size > MAX_VIDEO_SIZE) {
        setError("Video size must be less than 20MB");
        return;
      }

      setForm({ ...form, video: file });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setVideoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeVideo = () => {
    setForm({ ...form, video: null });
    setVideoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.make ||
      !form.modelName ||
      !form.price ||
      !form.mileage ||
      !form.description ||
      !form.phone
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setStep("preview");
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("vehicleType", form.vehicleType);
      formData.append("make", form.make);
      formData.append("modelName", form.modelName);
      formData.append("year", String(Number(form.year)));
      formData.append("price", String(Number(form.price)));
      formData.append("mileage", String(Number(form.mileage)));
      formData.append("fuelType", form.fuelType);
      formData.append("condition", form.condition);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("phone", form.phone);

      form.images.forEach((image) => {
        formData.append("images", image);
      });

      if (form.video) {
        formData.append("video", form.video);
      }

      await apiClient.post("/vehicles/sell", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStep("success");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post vehicle listing"
      );
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (step === "form") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4 py-6 sm:py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-sky-100"
        >
          <div className="mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full mb-2 sm:mb-3">
              <Car className="text-white" size={20} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1.5">
              Sell Your Vehicle
            </h2>
            <p className="text-sm sm:text-base text-slate-500 px-2">
              Fill in the details and upload images of your vehicle
            </p>
          </div>


          {error && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Vehicle Type *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, vehicleType: "car", make: "" })}
                className={`p-2.5 sm:p-3 rounded-xl border-2 transition font-medium text-sm sm:text-base ${
                  form.vehicleType === "car"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
                }`}
              >
                Car
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, vehicleType: "bike", make: "" })}
                className={`p-2.5 sm:p-3 rounded-xl border-2 transition font-medium text-sm sm:text-base ${
                  form.vehicleType === "bike"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-300"
                }`}
              >
                Motorcycle/Bike
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Make/Brand *
              </label>
              <select
                name="make"
                value={form.make}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  paddingRight: "2.5rem",
                }}
                required
              >
                <option value="">Select a brand</option>
                {brandsByType[form.vehicleType].map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Model *
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="text"
                  name="modelName"
                  value={form.modelName}
                  onChange={handleChange}
                  placeholder="e.g., Civic, Accord"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Year *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Price (BDT) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Mileage (km) *
            </label>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
              <input
                type="number"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                placeholder="e.g., 50000"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={form.fuelType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Vehicle Condition *
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%230ea5e9' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="needs-repair">Needs Repair</option>
            </select>
          </div>

          {/* LOCATION - Vehicle location city/area */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                  placeholder="Dhaka, Chittagong, Sylhet, etc."
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              />
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the vehicle condition, features, and any additional details..."
              rows="4"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition resize-none"
              required
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              <Image className="inline mr-2" size={14} />
              Vehicle Images * ({form.images.length}/5)
            </label>
            <label className="flex flex-col items-center justify-center w-full p-2.5 sm:p-3 border-2 border-dashed border-sky-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition bg-sky-50/50">
              <Upload className="text-sky-500 mb-2" size={20} />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center px-2">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imagePreview.length > 0 && (
              <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 sm:h-28 object-cover rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              <Video className="inline mr-2" size={14} />
              Vehicle Video (Optional, Max 20MB)
            </label>
            <label className="flex flex-col items-center justify-center w-full p-2.5 sm:p-3 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition bg-amber-50/50">
              <Upload className="text-amber-500 mb-2" size={20} />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center px-2">
                Click to upload video
              </span>
              <span className="text-xs text-slate-500 mt-1">MP4, MOV, AVI up to 20MB</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>

            {videoPreview && (
              <div className="mt-3 sm:mt-4 relative group">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Phone *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXXXXXXXX or 01XXXXXXXXX"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-lg hover:shadow-xl transition duration-200 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            }`}
          >
            Review & Post
          </button>
        </form>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4 py-6 sm:py-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-sky-100">
          <div className="mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Review Your Listing
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Make sure everything looks correct before posting
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Vehicle Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                
                <div>
                  <p className="text-slate-500">Model</p>
                  <p className="font-medium text-slate-900">{form.modelName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Year</p>
                  <p className="font-medium text-slate-900">{form.year}</p>
                </div>
                <div>
                  <p className="text-slate-500">Price</p>
                  <p className="font-medium text-slate-900">৳ {parseInt(form.price).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Mileage</p>
                  <p className="font-medium text-slate-900">{parseInt(form.mileage).toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-slate-500">Condition</p>
                  <p className="font-medium text-slate-900 capitalize">{form.condition}</p>
                </div>
              </div>
            </div>

            {imagePreview.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreview.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {videoPreview && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Video</h3>
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 rounded-lg"
                />
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-700 text-sm whitespace-pre-line">{form.description}</p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex-1 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base text-slate-700 font-semibold border-2 border-slate-300 hover:border-slate-400 transition"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-lg transition ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
              }`}
            >
              {loading ? "Posting..." : "Confirm & Post"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100 p-3 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-green-100 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 sm:mb-5">
            <CheckCircle className="text-white" size={28} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
            Listing Posted!
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6 px-2">
            Your vehicle listing has been successfully posted. Redirecting home...
          </p>

          <div className="inline-block">
            <HashLoader color="#0ea5e9" size={40} />
          </div>
        </div>
      </div>
    );
  }
}
