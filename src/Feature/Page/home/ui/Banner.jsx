import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Car, ShieldCheck } from "lucide-react";

const banners = [
  {
    title: "Buy Trusted Bikes & Cars",
    subtitle:
      "Browse verified second-hand vehicles with transparent pricing and trusted sellers.",
    ctaPrimary: "Browse Vehicles",
    ctaSecondary: "Sell Your Vehicle",
    ctaPrimaryHref: "/cars",
    ctaSecondaryHref: "/sell",
    bg: "from-emerald-600 via-teal-600 to-cyan-600",
    icon: <ShieldCheck size={28} />,
    stats: ["Verified Sellers", "Fair Price", "Easy Chat"],
    image: "/logo.png",
  },
  {
    title: "Sell Faster with NextRide",
    subtitle:
      "List your bike or car, receive offers, and sell at the best market value.",
    ctaPrimary: "Sell Now",
    ctaSecondary: "How It Works",
    ctaPrimaryHref: "/sell",
    ctaSecondaryHref: "/blog",
    bg: "from-sky-500 via-blue-300 to-indigo-300",
    icon: <Bike size={28} />,
    stats: ["Quick Listing", "Real Buyers", "Best Deals"],
    image: "/logo.png",
  },
  {
    title: "Rent Vehicles from Organizations",
    subtitle:
      "Daily, weekly, or monthly rentals from trusted showrooms and agencies.",
    ctaPrimary: "View Rentals",
    ctaSecondary: "For Organizations",
    ctaPrimaryHref: "/rent",
    ctaSecondaryHref: "/organizations",
    bg: "from-purple-600 via-fuchsia-600 to-pink-600",
    icon: <Car size={28} />,
    stats: ["Flexible Plans", "Trusted Orgs", "Easy Booking"],
    image: "/logo.png",
  },
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const current = banners[index];

  return (
    <section
      className="w-full overflow-hidden"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={`w-full bg-gradient-to-r ${current.bg} text-white`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Icon */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {current.icon}
                </div>
                <span className="uppercase text-sm tracking-wide text-white/80">
                  NextRide Marketplace
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-xl">
                {current.title}
              </h1>

              <p className="text-lg text-white/90 max-w-xl">
                {current.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                {current.stats.map((stat) => (
                  <span
                    key={stat}
                    className="rounded-full bg-white/15 px-4 py-1.5 text-sm"
                  >
                    {stat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={current.ctaPrimaryHref || "#"}
                  className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                >
                  {current.ctaPrimary}
                </a>

                <a
                  href={current.ctaSecondaryHref || "#"}
                  className="rounded-full border border-white/60 px-7 py-3 text-sm font-medium hover:bg-white/10 transition"
                >
                  {current.ctaSecondary}
                </a>
              </div>
            </motion.div>

            {/* RIGHT VISUAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative w-80 h-80 rounded-3xl bg-white/15 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                <img
                  src={current.image || "/logo.png"}
                  alt="NextRide visual"
                  className="w-full h-full object-contain p-6"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center">{index + 1}</span>
                  Featured
                </div>
              </div>
            </motion.div>
          </div>

          {/* INDICATORS */}
          <div className="flex justify-center gap-2 pb-6">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition ${
                  i === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
