import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosInstance';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { CheckCircle, X } from 'lucide-react';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '',
    allowRegistration: true,
    platformFeeRate: 0.05,
    maxListingsPerUser: 10,
    contactEmail: '',
    maintenanceMode: false,
    homeBannerText: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/settings');
      setSettings((prev) => ({
        ...prev,
        ...data,
        platformFeeRate: data.platformFeeRate ?? data.commissionRate ?? prev.platformFeeRate,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await apiClient.patch('/admin/settings', settings);

      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaving(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || err.message || 'Failed to save settings');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Show loading screen during save
  if (saving) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Success Toast - Right Side */}
      {showSuccessModal && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md border-l-4 border-green-500">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Settings Updated!</h3>
                <p className="text-slate-600 text-sm mt-1">Your system settings have been successfully saved.</p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">System Settings</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}</div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Platform Fee Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="platformFeeRate"
                value={settings.platformFeeRate}
                onChange={(e) => setSettings((p) => ({ ...p, platformFeeRate: parseFloat(e.target.value) }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Max Listings Per User</label>
              <input
                type="number"
                min="1"
                name="maxListingsPerUser"
                value={settings.maxListingsPerUser}
                onChange={(e) => setSettings((p) => ({ ...p, maxListingsPerUser: parseInt(e.target.value) }))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Home Banner Text</label>
              <input
                type="text"
                name="homeBannerText"
                value={settings.homeBannerText}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleChange}
                className="w-5 h-5 rounded-md border-slate-300 text-sky-600 focus:ring-sky-300"
              />
              <span className="text-slate-700">Allow Registration</span>
            </label>
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-5 h-5 rounded-md border-slate-300 text-sky-600 focus:ring-sky-300"
              />
              <span className="text-slate-700">Maintenance Mode</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`rounded-xl px-5 py-2.5 text-white font-semibold ${saving ? 'bg-slate-400' : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700'} `}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
