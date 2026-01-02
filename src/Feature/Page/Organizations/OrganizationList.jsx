import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building2, Users } from "lucide-react";
import apiClient from "../../../api/axiosInstance";

export default function OrganizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      limit: 9,
      cursor: cursor || undefined,
    }),
    [search, cursor]
  );

  const fetchOrganizations = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = reset ? { ...fetchParams, cursor: undefined } : fetchParams;
      const response = await apiClient.get("/organizations", { params });
      const { data = [], nextCursor, hasMore: more = false } = response.data || {};

      setOrganizations((prev) => (reset ? data : [...prev, ...data]));
      setCursor(nextCursor || null);
      setHasMore(Boolean(more));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchOrganizations(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-sky-600 mb-2">Trusted partners</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Explore active organizations</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Browse verified organizations on NextRide and connect with sellers backed by active business accounts.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 bg-white shadow-sm border border-slate-200 rounded-2xl px-4 py-3 mb-6">
          <div className="flex items-center w-full gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <Search size={18} />
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations by name or email"
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-sky-700 transition"
          >
            <Search size={16} />
            Search
          </button>
        </form>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <article
              key={org._id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-semibold mb-2">
                    <Building2 size={14} />
                    Active organization
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
                  <p className="text-sm text-slate-600">{org.email}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-semibold">
                  {org.name?.[0]?.toUpperCase() || "O"}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-sky-500" />
                  <span>{org.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-sky-500" />
                  <span>
                    Joined {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "recently"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  to={`/organizations/${org._id}`}
                  className="text-sky-600 text-sm font-semibold hover:text-sky-700"
                >
                  View details
                </Link>
                <span className="text-xs text-slate-500">ID: {org._id}</span>
              </div>
            </article>
          ))}
        </div>

        {loading && (
          <div className="mt-6 text-center text-sm text-slate-600">Loading organizations...</div>
        )}

        {!loading && organizations.length === 0 && !error && (
          <div className="mt-6 text-center text-sm text-slate-600">No organizations found.</div>
        )}

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => fetchOrganizations()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
