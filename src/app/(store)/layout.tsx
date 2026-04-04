import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { Footer } from "@/components/layout/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}
