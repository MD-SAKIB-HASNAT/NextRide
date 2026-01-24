import React from "react";
import { motion } from "framer-motion";

const brands = [
  { name: "Honda", logo: "/brand/honda.jpg" },
  { name: "BMW", logo: "/brand/bmw.jpg" },
  { name: "Toyota", logo: "/brand/toyota.png" },
  { name: "Nissan", logo: "/brand/nishan.jpg" },
  { name: "Suzuki", logo: "/brand/suzuki.png" },
  { name: "TVS", logo: "/brand/tvs.png" },
];

export default function BrandMarquee() {
  return (
    <section className="w-full bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Brands
        </h2>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {brands.map((brand, index) => (
              <div key={index} className="shrink-0 w-48">
                <div className="bg-white rounded-lg p-4 h-20 flex items-center justify-center shadow-md hover:shadow-lg transition">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-center text-slate-300 mt-12 text-sm">
          World's most trusted automotive brands
        </p>
      </div>
    </section>
  );
}
