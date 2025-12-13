import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    text: "Highly recommend for better deal in terms of exchange or buy a new motorcycle.",
    name: "Tajul Islam Raju",
    location: "Chadpur, Dhaka, Bangladesh",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "I already exchange 6 bikes from Sawari. 5 bikes condition very good and another 1 average but best price.",
    name: "Musharof Hossain",
    location: "Gazipur, Dhaka, Bangladesh",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    text: "Great Service 👌👌👌 Bike conditions are awesome 👌👌 and their friendly behaviour is too good. Number Taratari diyar jonno thanks ❤️",
    name: "Tanim Dudayev",
    location: "Dhaka, Bangladesh",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    text: "Very reliable platform. Easy buying process and excellent customer support. Will recommend to everyone.",
    name: "Arif Hasan",
    location: "Narayanganj, Bangladesh",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

export default function Feedback() {
  const [index, setIndex] = useState(0);

  const visibleReviews = reviews.slice(index, index + 3);

  const next = () => {
    if (index < reviews.length - 3) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section className="w-full bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <h2 className="text-3xl font-bold text-slate-900 mb-12">
          What Our User Says!
        </h2>

        <div className="relative">

          {/* Left arrow */}
          <button
            onClick={prev}
            className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-sky-500 text-white items-center justify-center shadow hover:bg-sky-600 transition disabled:opacity-40"
            disabled={index === 0}
          >
            <ChevronLeft />
          </button>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between"
              >
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {review.text}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  <Quote className="text-sky-500 w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-sky-500 text-white items-center justify-center shadow hover:bg-sky-600 transition disabled:opacity-40"
            disabled={index >= reviews.length - 3}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {Array.from({ length: reviews.length - 2 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition ${
                index === i
                  ? "w-8 bg-sky-500"
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
