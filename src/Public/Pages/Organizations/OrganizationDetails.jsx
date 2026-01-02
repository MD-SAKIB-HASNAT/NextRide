import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Mail, Phone, Shield, Clock } from "lucide-react";
import apiClient from "../../../api/axiosInstance";

export default function OrganizationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/organizations/${id}`);
        setOrganization(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Organization not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-sm text-slate-600">
            Loading organization details...
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && organization && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-5 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-xl font-semibold">
                  {organization.name?.[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Active organization</p>
                  <h1 className="text-2xl font-bold text-slate-900">{organization.name}</h1>
                  <p className="text-sm text-slate-600">Verified business account on NextRide</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Organization ID</p>
                  <p className="text-sm font-semibold text-slate-900">{organization._id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-slate-900">{organization.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-semibold text-slate-900">{organization.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
