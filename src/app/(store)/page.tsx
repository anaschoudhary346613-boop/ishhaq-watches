"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Classic Rose Gold Dress Watch",
    brand: "ISHHAQ & CO Classic",
    price: 18500,
    salePrice: 17000,
    imageUrl: "/luxury_watch_1.png",
  },
  {
    id: "2",
    name: "Oceanic Stainless Steel Diver",
    brand: "ISHHAQ & CO Sport",
    price: 14200,
    imageUrl: "/luxury_watch_2.png",
  },
];

export default function Home() {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        // Map DB snake_case to frontend camelCase
        const realProducts = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.regular_price,
          salePrice: p.sale_price,
          imageUrl: p.image_url || "/luxury_watch_1.png",
        }));
        setProducts(realProducts);
      }
    }
    
    fetchProducts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_watch_image.png"
            alt="Luxury Watch Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 mt-16 max-w-4xl mx-auto">
          <p className="text-[#c5a059] uppercase tracking-[0.3em] font-medium text-sm mb-4">
            A Legacy of Time
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
            Discover Quiet <br /> Luxury
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
            Curated pieces for the modern connoisseur. Invest in craftsmanship that lasts generations.
          </p>
          <Link
            href="#collection"
            className="inline-block bg-white text-[#121c2d] hover:bg-[#c5a059] hover:text-white transition-all duration-300 px-10 py-5 uppercase tracking-widest text-sm font-semibold"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="collection" className="py-32 px-6 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-[#121c2d] mb-4">Best Sellers</h2>
            <div className="w-16 h-0.5 bg-[#c5a059] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Image Card */}
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative bg-white aspect-[4/5] mb-6 overflow-hidden flex items-center justify-center p-8 transition-shadow hover:shadow-xl">
                    {product.salePrice && (
                      <div className="absolute top-4 left-4 bg-[#121c2d] text-white text-xs uppercase tracking-wider px-3 py-1 z-10">
                        Save {Math.round((1 - product.salePrice / product.price) * 100)}%
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-contain group-hover:scale-105 transition-transform duration-700 w-full h-full"
                    />
                    {/* Hover Add to Cart Button */}
                    <div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: product.id,
                            name: product.name,
                            brand: product.brand,
                            price: product.salePrice || product.price,
                            imageUrl: product.imageUrl,
                          });
                        }}
                        className="w-full bg-[#121c2d]/95 backdrop-blur text-white py-4 font-medium uppercase tracking-widest text-sm hover:bg-[#c5a059] transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{product.brand}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-serif text-[#121c2d] mb-2 group-hover:text-[#c5a059] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex justify-center items-center gap-3">
                    {product.salePrice ? (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[#c5a059] font-medium">
                          ₹{product.salePrice.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#121c2d] font-medium">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage / Lifestyle Section */}
      <section className="bg-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] bg-[#faf9f6] rounded-sm group overflow-hidden">
            <Image
              src="/lifestyle_experience.png"
              alt="Heritage Lifestyle"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </div>
          <div className="space-y-8">
            <p className="text-[#c5a059] uppercase tracking-[0.3em] font-medium text-xs">The Heritage</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#121c2d] leading-tight">
              A Personal Investment <br /> in Excellence
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              At ISHHAQ & CO, we believe a timepiece is more than a tool for measurement. It is an heirloom, a story, and a statement of character. Our master curators hand-select each piece to ensure it meets our rigorous standards of authenticity and timeless aesthetic.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-2xl font-serif text-[#121c2d] mb-1">01</p>
                <p className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold mb-2">Authenticated</p>
                <p className="text-xs text-gray-400 leading-normal">Every watch undergoes a 40-point verification by our master horologists.</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-[#121c2d] mb-1">02</p>
                <p className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold mb-2">Global Access</p>
                <p className="text-xs text-gray-400 leading-normal">Complimentary insured express shipping to over 120 countries worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#121c2d] py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-70">
          <div className="text-center">
            <p className="text-white font-serif text-xl mb-1">Lifetime</p>
            <p className="text-[#c5a059] text-[10px] uppercase tracking-widest">Auth Guarantee</p>
          </div>
          <div className="text-center">
            <p className="text-white font-serif text-xl mb-1">24/7</p>
            <p className="text-[#c5a059] text-[10px] uppercase tracking-widest">Elite Concierge</p>
          </div>
          <div className="text-center">
            <p className="text-white font-serif text-xl mb-1">Insured</p>
            <p className="text-[#c5a059] text-[10px] uppercase tracking-widest">Global Delivery</p>
          </div>
        </div>
      </section>

    </div>
  );
}


