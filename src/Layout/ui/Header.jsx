import React, { useState } from "react";
import { Phone, Search, Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Buy Bikes", href: "/bikes" },
    { label: "Buy Cars", href: "/cars" },
    { label: "Sell Vehicle", href: "/sell" },
    { label: "Rent Vehicles", href: "/rent" },
    { label: "Organizations", href: "/organizations" },
    { label: "Accessories", href: "/accessories" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="NextRide logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-lg font-semibold text-slate-900 hidden sm:block">
                NextRide
              </span>
            </a>
          </div>

          <div className="flex justify-center">
            <form className="w-full max-w-xl relative">
              <input
                type="search"
                placeholder="Search bikes, cars, brands..."
                className="w-full rounded-full border border-slate-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center">
                <Phone size={16} className="text-sky-500" />
              </div>
              <div className="text-sm leading-tight">
                <p className="text-slate-500 text-xs">Support</p>
                <p className="font-medium text-slate-900">01992403647</p>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-sm text-white font-medium hover:bg-sky-600 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="hidden md:inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-sm text-white font-medium hover:bg-sky-600 transition"
              >
                Login
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md border border-slate-200"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden md:block bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`text-sm font-medium ${
                    link.label === "Home"
                      ? "text-sky-600"
                      : "text-slate-600 hover:text-sky-600"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 rounded text-sm text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">Support</p>
              <p className="font-medium text-slate-900">01992403647</p>

              {isLoggedIn ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileOpen(false);
                    }}
                    className="w-full text-center rounded-full bg-sky-500 px-4 py-2 text-white text-sm font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-center rounded-full border border-red-300 px-4 py-2 text-red-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="mt-3 inline-block w-full text-center rounded-full bg-sky-500 px-4 py-2 text-white text-sm"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
