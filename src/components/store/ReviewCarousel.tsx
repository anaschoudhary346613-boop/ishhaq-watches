"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Alexander H.",
    location: "London, UK",
    text: "The sourcing concierge found the exact discontinued Patek I was looking for. Impeccable condition and hand-delivered securely. A truly world-class experience from start to finish.",
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: "Omar A.",
    location: "Dubai, UAE",
    text: "I was hesitant wiring funds internationally, but the ISHAAQ & CO team was completely transparent. The watch arrived exactly as described with all original papers and digital authenticity verification.",
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: "Vikram S.",
    location: "Mumbai, IN",
    text: "Purchased a vintage Day-Date. The macro shots on the site didn't do it justice. It runs perfectly, showing the high level of horological standards they claim. Will be returning for my next piece.",
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: "James T.",
    location: "New York, USA",
    text: "Fast shipping, incredible packaging, and the watch was polished to perfection. Best luxury buying experience I've had online.",
    rating: 5,
    verified: true,
  }
];

export function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % REVIEWS.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#121c2d] py-24 md:py-32 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="mb-12">
          <h2 className="text-[#c5a059] uppercase tracking-[0.3em] font-medium text-xs mb-4">Client Feedback</h2>
          <p className="text-3xl md:text-4xl font-serif text-white">Trusted Globally</p>
        </div>

        <div className="relative min-h-[220px] md:min-h-[180px] flex items-center justify-center">
          {REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              className={`absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out ${
                idx === activeIndex
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8 pointer-events-none"
              }`}
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c5a059] text-[#c5a059]" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-gray-300 font-serif italic leading-relaxed mb-8 px-4 md:px-12">
                "{review.text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-[#1a2942] rounded-full flex items-center justify-center text-[#c5a059] font-serif text-lg">
                  {review.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium tracking-wide flex items-center gap-2">
                    {review.name}
                    {review.verified && (
                      <span className="text-[9px] uppercase bg-green-900/40 text-green-400 px-2 py-0.5 rounded border border-green-800/50 tracking-widest font-sans">
                        Verified
                      </span>
                    )}
                  </p>
                  <p className="text-[#c5a059] text-xs opacity-80">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 transition-all duration-500 rounded-full ${
                idx === activeIndex ? "w-8 bg-[#c5a059]" : "w-2 bg-gray-700 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
