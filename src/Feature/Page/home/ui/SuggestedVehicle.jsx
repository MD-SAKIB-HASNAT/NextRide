import React from "react";

const vehicles = [
  {
    id: 1,
    name: "Royal Enfield Hunter 350 Rebel Blue",
    km: "2200KM",
    price: "৳ 344,000",
    color: "Rebel Blue",
    image:
      "https://images.unsplash.com/photo-1622185135505-2d795003994a",
    sold: false,
  },
  {
    id: 2,
    name: "Honda CB 150R Xmotion",
    km: "8450KM",
    price: "৳ 559,000",
    color: "Tri Color",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    sold: true,
  },
  {
    id: 3,
    name: "Yamaha FZS V4 ABS Matte Black",
    km: "3600KM",
    price: "৳ 275,000",
    color: "Matte Black",
    image:
      "https://images.unsplash.com/photo-1622185135505-2d795003994a",
    sold: false,
  },
  {
    id: 4,
    name: "CF Moto NK250 ABS Nebula Blue",
    km: "350KM",
    price: "৳ 317,000",
    color: "Nebula Blue",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
    sold: false,
  },
];

export default function SuggestedVehicle() {
  return (
    <section className="w-full bg-slate-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">
          Suggested Vehicles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />

                {item.sold && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                  {item.name} {item.km}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-sky-600">
                    {item.price}
                  </span>
                  <span className="text-xs border border-slate-300 rounded px-2 py-0.5 text-slate-600">
                    USED
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  Available Color:{" "}
                  <span className="font-medium text-slate-700">
                    {item.color}
                  </span>
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    disabled={item.sold}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      item.sold
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-sky-600 text-white hover:bg-sky-700"
                    }`}
                  >
                    View Details
                  </button>

                  <button
                    disabled={item.sold}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium border transition ${
                      item.sold
                        ? "border-slate-300 text-slate-400 cursor-not-allowed"
                        : "border-sky-600 text-sky-600 hover:bg-sky-50"
                    }`}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="rounded-full border border-sky-600 px-8 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition">
            View All Vehicles
          </button>
        </div>
      </div>
    </section>
  );
}
