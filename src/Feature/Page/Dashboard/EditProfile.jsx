import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Save, X, ArrowLeft, Camera, Lock } from "lucide-react";
import apiClient from "../../../api/axiosInstance";
import HashLoader from "react-spinners/HashLoader";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      const userId = stored?._id || stored?.id;
      if (!userId) {
        navigate("/login");
        return;
      }
      const { data } = await apiClient.get(`/user/${userId}`);
      setUser(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
      });
      if (data.profilePhoto) {
        // profilePhoto already contains the full path from backend (e.g., 'uploads/profiles/...')
        const photoUrl = data.profilePhoto.startsWith('http') 
          ? data.profilePhoto 
          : `${import.meta.env.VITE_API_URL}/${data.profilePhoto}`;
        setPhotoPreview(photoUrl);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to load profile data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
      setError("");
      setSuccess("");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await apiClient.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
    } catch (err) {
      console.error("Password change failed:", err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateFormData = new FormData();
      updateFormData.append("name", formData.name);
      updateFormData.append("phone", formData.phone);
      if (photoFile) {
        updateFormData.append("profilePhoto", photoFile);
      }

      const response = await apiClient.put("/user/profile", updateFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update localStorage with new user data
      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HashLoader color="#2563eb" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                user.name?.slice(0, 1) || "N"
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-slate-500">Update your name, phone and photo</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
              <X size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
              <Save size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Information Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                <Camera size={16} className="inline mr-2" />
                Profile Photo
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Photo Preview */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-3xl font-semibold shadow-lg flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.name?.slice(0, 1) || "N"
                  )}
                </div>
                
                {/* Upload Input */}
                <div className="flex-1">
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div className="px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition text-center">
                      <p className="text-sm font-semibold text-blue-700">Click to upload photo</p>
                      <p className="text-xs text-blue-600 mt-1">JPG, PNG or GIF (max 5MB)</p>
                    </div>
                  </label>
                  {photoFile && (
                    <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                      ✓ {photoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="flex items-center justify-center">
                    <HashLoader color="#ffffff" size={20} />
                  </div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </form>

          {/* Password Change Section */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              <Lock size={18} />
              {showPasswordSection ? "Hide" : "Change"} Password
            </button>

            {showPasswordSection && (
              <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <HashLoader color="#ffffff" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
