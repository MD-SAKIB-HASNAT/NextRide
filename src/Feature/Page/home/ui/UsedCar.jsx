import React from "react";

const cars = [
  {
    id: 1,
    name: "Toyota Corolla Axio",
    price: "৳ 1,750,000",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1b",
  },
  {
    id: 2,
    name: "Honda Civic Turbo",
    price: "৳ 2,950,000",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
  },
  {
    id: 3,
    name: "Toyota Premio G Superior",
    price: "৳ 3,150,000",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442",
  },
  {
    id: 4,
    name: "Nissan X-Trail Hybrid",
    price: "৳ 3,450,000",
    image: "https://images.unsplash.com/photo-1609520505218-7421f4d66a06",
  },
  {
    id: 5,
    name: "Toyota Allion",
    price: "৳ 2,650,000",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
  },
  {
    id: 6,
    name: "Honda Vezel Hybrid",
    price: "৳ 3,850,000",
    image: "https://images.unsplash.com/photo-1609520505218-7421f4d66a06",
  },
];

export default function UsedCar() {
  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">Car</h2>

          <button className="rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl border border-blue-200 shadow-lg p-4"
              >
                <span className="inline-block mb-2 rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">
                  Sell
                </span>

                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-32 object-contain mb-4"
                />

                <h4 className="text-sm font-medium text-slate-900 mb-2">
                  {car.name}
                </h4>

                <p className="text-xs text-slate-500 mb-1">Get upto</p>

                <p className="text-lg font-semibold text-slate-800">
                  {car.price}
                </p>
              </div>
            ))}
          </div>

          <div className="md:flex md:items-center lg:flex-col lg:col-span-1 bg-gradient-to-b from-sky-100 to-white rounded-xl overflow-hidden shadow-md border border-blue-300 p-6">
            <img
              src="/logo-bg-remove.png"
              alt="Sell Car"
              className="object-cover mb-4"
            />

            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                গাড়ি বিক্রি করুন
              </h3>
              <p className="text-lg font-semibold text-sky-600 mb-4">
                সেরা দামে
              </p>

              <a
                href="/sell"
                className="inline-block rounded-full border border-sky-600 px-6 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50"
              >
                SELL NOW
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
