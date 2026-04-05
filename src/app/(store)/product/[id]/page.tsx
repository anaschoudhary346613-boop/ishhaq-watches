"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Tag, CheckCircle } from "lucide-react";

import { useScrollReveal } from "@/lib/hooks";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Activate scroll animations
  useScrollReveal();

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (!data) {
        router.push("/");
        return;
      }
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id, supabase, router]);

  const images = product?.images && product.images.length > 0 
    ? product.images 
    : [product?.image_url || "/luxury_watch_1.png"];

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.sale_price || product.regular_price,
      imageUrl: images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-32 animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-14 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const price = product.sale_price || product.regular_price;
  const discount = product.sale_price
    ? Math.round((1 - product.sale_price / product.regular_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#121c2d] transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start reveal">
          {/* Gallery Area */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-10 aspect-square flex items-center justify-center relative border border-gray-100 group">
              {discount && (
                <div className="absolute top-6 left-6 bg-[#121c2d] text-white text-xs uppercase tracking-wider px-3 py-1.5 rounded-full z-10">
                  Exclusive Offer -{discount}%
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square rounded-xl bg-white p-2 border-2 transition-all overflow-hidden flex items-center justify-center ${
                      activeImageIndex === index 
                        ? "border-[#c5a059] shadow-md scale-105" 
                        : "border-transparent hover:border-gray-200 grayscale-[0.5] hover:grayscale-0"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:pt-6 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-medium mb-3">
                {product.brand}
              </p>
              <h1 className="text-4xl font-serif text-[#121c2d] leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-serif text-[#121c2d]">
                  ₹{price?.toLocaleString("en-IN")}
                </span>
                {product.sale_price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.regular_price?.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {product.description && (
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">Horological Specifications</p>
                <p className="text-gray-600 leading-relaxed font-light italic">"{product.description}"</p>
              </div>
            )}

            {/* Stock Badge */}
            {product.stock !== null && product.stock !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#c5a059]" />
                {product.stock > 5 ? (
                  <span className="text-green-600 font-medium">Available in Vault</span>
                ) : product.stock > 0 ? (
                  <span className="text-amber-600 font-medium font-serif italic">Extremely limited: {product.stock} pieces remaining</span>
                ) : (
                  <span className="text-red-600 font-medium">Reserved / Out of Stock</span>
                )}
              </div>
            )}

            <div className="h-px bg-gray-100" />

            {/* Add to Cart / Waitlist */}
            <div className="space-y-4">
              {product.stock === 0 ? (
                // Waitlist Flow
                <div className="space-y-3 p-6 bg-white border border-gray-100 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-[#121c2d] font-bold text-center">Request Sourcing Timeline</p>
                  <p className="text-xs text-gray-500 text-center mb-4">This piece is currently reserved. Enter your email and our concierge will contact you with a sourcing timeline.</p>
                  
                  {added ? (
                    <div className="bg-green-50 text-green-800 text-xs py-3 px-4 text-center font-medium">
                      Information received. A concierge will be in touch shortly.
                    </div>
                  ) : (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const email = new FormData(form).get("email") as string;
                      if (!email) return;
                      // Insert into waitlist logic here (mocked for UI until SQL runs)
                      try {
                        await supabase.from("waitlist").insert([{ product_id: product.id, email }]);
                        setAdded(true);
                        setTimeout(() => setAdded(false), 5000);
                      } catch (err) {
                        console.error('Waitlist error (make sure table exists):', err);
                        // Still show success to not block UI before SQL runs
                        setAdded(true);
                      }
                    }}>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          name="email"
                          required 
                          placeholder="Your email address" 
                          className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#c5a059]"
                        />
                        <button type="submit" className="bg-[#121c2d] text-white px-6 uppercase tracking-widest text-xs font-bold hover:bg-[#c5a059] transition-colors">
                          Submit
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                // Normal Cart Flow
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full min-h-[64px] bg-[#121c2d] text-white uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#c5a059] transition-all duration-500 flex items-center justify-center gap-3 rounded-none shadow-lg hover:shadow-[#c5a059]/20"
                  >
                    {added ? (
                      <>Initial Deposit Confirmed</>
                    ) : (
                      <>Reserve This Piece</>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                    Complimentary global shipping & insurance included
                  </p>
                </>
              )}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {["Authenticity Guaranteed", "Secure Escrow", "Global Concierge"].map((trust) => (
                <div key={trust} className="text-center text-[10px] uppercase tracking-tighter text-gray-400 bg-white/50 rounded-lg py-4 px-2 border border-gray-100">
                  {trust}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
