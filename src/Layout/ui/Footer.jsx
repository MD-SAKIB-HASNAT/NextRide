import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand & intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-slate-800 flex items-center justify-center">
                <img src="/logo.png" alt="logo" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">NextRide</h3>
                <p className="text-slate-400 text-sm">
                  Buy • Sell • Rent bikes & cars
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              NextRide is a trusted marketplace for second-hand bikes and cars.
              Users can list vehicles, compare prices, chat with sellers, and
              make secure offers. Organizations can manage inventory and
              rentals.
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold">Contact</h4>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center">
                <MapPin size={18} className="text-sky-400" />
              </div>
              <div>
                <p className="font-medium">Head Office</p>
                <p className="text-slate-400 text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center">
                <Phone size={18} className="text-sky-400" />
              </div>
              <div>
                <p className="font-medium">
                  <a href="tel:01992403647" className="hover:underline">
                    01992403647
                  </a>
                </p>
                <p className="text-slate-400 text-sm">Support & Orders</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center">
                <Mail size={18} className="text-sky-400" />
              </div>
              <div>
                <p className="font-medium">
                  <a
                    href="mailto:support@nextride.com"
                    className="text-sky-400 hover:underline"
                  >
                    support@nextride.com
                  </a>
                </p>
                <p className="text-slate-400 text-sm">General enquiries</p>
              </div>
            </div>
          </div>

          {/* About & social */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Why NextRide?</h4>

            <p className="text-slate-400 text-sm leading-relaxed">
              Verified sellers, transparent pricing, real-time chat, offers, and
              rental support make NextRide a safe and reliable platform for both
              buyers and sellers.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-md bg-slate-800 hover:bg-sky-600 transition flex items-center justify-center"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="/SSLCommerz-Pay.png"
            alt="SSLCommerz"
            className="object-cover"
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} NextRide. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="/terms" className="hover:underline">
              Terms
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
