import React from "react";
import { CheckCircle, MapPin, Phone, Shield, Star } from "lucide-react";

export default function About() {
  const pillars = [
    {
      title: "Trusted Marketplace",
      desc: "Verified sellers, transparent pricing, and secure payments keep every transaction reliable.",
      icon: Shield,
    },
    {
      title: "Expert Support",
      desc: "Real people who know bikes and cars, ready to help you list, inspect, and close deals fast.",
      icon: Phone,
    },
    {
      title: "Nationwide Reach",
      desc: "Logistics partners and regional hubs mean your next ride can come from anywhere and arrive safely.",
      icon: MapPin,
    },
  ];

  const stats = [
    { label: "Verified listings", value: "18k+" },
    { label: "Cities covered", value: "120+" },
    { label: "Average rating", value: "4.8" },
    { label: "Support hours", value: "24/7" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-50 via-white to-white">
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold text-sky-700">
            <Star size={14} /> Trusted by riders and drivers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            We make moving easier, safer, and more transparent.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            NextRide connects buyers, sellers, and renters with a platform built for confidence. From smart filters to human help, we keep every step clear so you can focus on the road ahead.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/cars"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-sm hover:bg-slate-800 transition"
            >
              Browse cars
            </a>
            <a
              href="/bikes"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-300 text-slate-800 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition"
            >
              Browse bikes
            </a>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-sky-50 px-4 py-5 border border-sky-100">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-900 text-white px-4 py-4">
            <Shield size={18} className="mt-0.5" />
            <div>
              <p className="font-semibold">We verify every listing</p>
              <p className="text-sm text-slate-200">IDs, ownership proofs, and condition checks keep scams out of the marketplace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map(({ title, desc, icon: Icon }) => (
          <div key={title} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-sky-100 text-sky-700">
              <Icon size={18} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">Support that cares</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Talk to a human within minutes</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Need help listing, inspecting, or paying? Message us and a specialist will respond fast. We are here to keep your next ride smooth.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Listing guidance</span>
              <span className="inline-flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Safe payment flows</span>
              <span className="inline-flex items-center gap-2"><CheckCircle size={16} className="text-emerald-600" /> Post-sale follow-up</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <a
              href="tel:01992403647"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              <Phone size={18} /> Call support
            </a>
            <a
              href="/subscriptions"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-slate-900 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 transition"
            >
              Explore subscriptions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
