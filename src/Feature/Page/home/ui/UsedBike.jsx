import React from "react";

const bikes = [
  {
    id: 1,
    name: "TVS Apache RTR 160 4V DD X-Connect ABS",
    price: "৳ 1,78,000",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65",
  },
  {
    id: 2,
    name: "Yamaha R15 V3.0 Dual ABS",
    price: "৳ 3,80,000",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a",
  },
  {
    id: 3,
    name: "Yamaha FZS FI V3 ABS BS6",
    price: "৳ 2,34,000",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a",
  },
  {
    id: 4,
    name: "Bajaj Pulsar 150 Twin Disc ABS",
    price: "৳ 1,74,000",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a",
  },
  {
    id: 5,
    name: "Bajaj Avenger 160 ABS",
    price: "৳ 1,99,000",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a",
  },
  {
    id: 6,
    name: "Suzuki Gixxer DD Fi ABS",
    price: "৳ 2,18,000",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a",
  },
];

export default function UsedBike() {
  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Motorcycle</h2>

          <button className="rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="md:flex md:items-center lg:flex-col lg:col-span-1 bg-gradient-to-b from-sky-100 to-white rounded-xl overflow-hidden shadow-md border border-blue-300 p-6">
            <img
              src="/logo-bg-remove.png"
              alt="Sell Bike"
              className="object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                মোটরসাইকেল বিক্রি করুন
              </h3>
              <p className="text-lg font-semibold text-sky-600 mb-4">
                সেরা দামে
              </p>

              <button className="rounded-full border border-sky-600 px-6 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50 cursor-pointer">
                <a href="/sell">SELL NOW</a>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl border border-blue-200 shadow-lg p-4"
              >
                <span className="inline-block mb-2 rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">
                  Sell
                </span>

                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-32 object-contain mb-4"
                />

                <h4 className="text-sm font-medium text-slate-900 mb-2">
                  {bike.name}
                </h4>

                <p className="text-xs text-slate-500 mb-1">Get upto</p>

                <p className="text-lg font-semibold text-slate-800">
                  {bike.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
