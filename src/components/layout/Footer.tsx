import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#121c2d] text-white pt-20 pb-10 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <span className="font-serif text-2xl tracking-wide text-white block">
              ISHAAQ & CO
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
              Timepiece
            </span>
          </Link>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Curators of exquisite vintage and modern luxury watches. Every piece in our collection is rigorously authenticated and serviced to the highest standards.
          </p>
        </div>
        
        <div>
          <h3 className="text-[#c5a059] uppercase tracking-widest text-xs font-medium mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/account/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link href="https://wa.me/919890902869" target="_blank" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#c5a059] uppercase tracking-widest text-xs font-medium mb-6">Global Presence</h3>
          <ul className="space-y-4 text-[10px] uppercase tracking-widest text-gray-500">
            <li>London • Mayfair</li>
            <li>Dubai • DIFC</li>
            <li>Mumbai • BKC</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} ISHAAQ & CO. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          <span>Secure Payments</span>
          <span>Global Shipping</span>
        </div>
      </div>
    </footer>
  );
}

