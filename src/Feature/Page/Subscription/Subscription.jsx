import React from "react";
import { CheckCircle2, Sparkles, Shield, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "tk.90/mo",
    badge: "Best for individuals",
    perks: [
      "Up to 10 listings per month",
      "No platform fee",
      "Standard support",
      "Basic visibility boost",
    ],
    accent: "from-sky-500/10 to-blue-500/10",
    border: "border-sky-200",
  },
  {
    name: "Growth",
    price: "tk.190/mo",
    badge: "Popular for small teams",
    perks: [
      "Up to 30 listings per month",
      "Platform fee reduced",
      "Priority chat & email support",
      "Featured placement",
      "Bulk upload assistant",
    ],
    accent: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "tk.390/mo",
    badge: "For power sellers",
    perks: [
      "Unlimited listings",
      "Platform fee reduced",
      "Dedicated success manager",
      "Always-on featured placement",
      "Advanced analytics & reports",
      "API access for inventory sync",
    ],
    accent: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
  },
];

export default function Subscription() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
            <Sparkles size={16} />
            Upcoming Subscription Plans
          </div>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Scale your selling with the right plan</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Choose a plan that increases your monthly post limits, lowers platform fees, and unlocks premium visibility & support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${plan.border} bg-white shadow-sm overflow-hidden`}
            >
              {plan.highlighted && (
                <div className="absolute right-4 top-4 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                  Recommended
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.accent}`} />

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{plan.badge}</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{plan.name}</h2>
                  <p className="text-3xl font-bold text-slate-900">{plan.price}</p>
                </div>

                <ul className="space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-200 text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {plan.highlighted ? <Rocket size={16} /> : <Shield size={16} />}
                  Choose {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
