import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function WhatsAppFloat() {
  // Replace with the business owner's actual phone number
  const phoneNumber = "919890902869";
  const message = "Hello, I'm interested in ISHAAQ & CO collections. Can you help me?";

  return (
    <Link
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center p-4 bg-[#25D366] text-white rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </Link>
  );
}

