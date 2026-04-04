"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCheck, Smartphone } from "lucide-react";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "ISHAAQ@upi";
const MERCHANT_NAME = "ISHAAQ & CO";

interface UPIPaymentProps {
  total: number;
}

export function UPIPayment({ total }: UPIPaymentProps) {
  const [copied, setCopied] = useState(false);

  // Standard UPI deep-link URI — works natively with all UPI apps
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent("Order from ISHAAQ & CO")}`;

  // GPay, PhonePe, Paytm use the same UPI URI scheme on mobile
  const upiApps = [
    {
      name: "Google Pay",
      color: "#4285F4",
      bg: "#EEF2FF",
      icon: "G",
      href: upiUri,
    },
    {
      name: "PhonePe",
      color: "#5F259F",
      bg: "#F5EEFF",
      icon: "P",
      href: upiUri,
    },
    {
      name: "Paytm",
      color: "#00B9F1",
      bg: "#E6F9FF",
      icon: "PT",
      href: upiUri,
    },
    {
      name: "BHIM",
      color: "#E64524",
      bg: "#FEECEB",
      icon: "B",
      href: upiUri,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 bg-[#121c2d] rounded-full flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-[#121c2d]">Pay via UPI</h3>
          <p className="text-xs text-gray-400">Scan QR or tap an app below</p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm inline-block">
            <QRCodeSVG
              value={upiUri}
              size={180}
              bgColor="#ffffff"
              fgColor="#121c2d"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Scan with any UPI app
          </p>
          <div className="mt-3 bg-[#faf9f6] border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 w-full max-w-xs">
            <span className="text-sm font-mono text-[#121c2d] flex-1 tracking-tight">{UPI_ID}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-[#c5a059] transition-colors flex-shrink-0"
              title="Copy UPI ID"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* UPI App Buttons */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Open in App</p>
          <div className="grid grid-cols-2 gap-3">
            {upiApps.map((app) => (
              <a
                key={app.name}
                href={app.href}
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-300 transition-all hover:shadow-sm"
                style={{ backgroundColor: app.bg }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                <span className="text-xs font-medium text-gray-700">{app.name}</span>
              </a>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700 leading-relaxed">
            <strong>How it works:</strong> Pay ₹{total.toLocaleString("en-IN")} to our UPI ID, then tap <strong>"I Have Paid"</strong> below. We verify all payments before dispatching.
          </div>
        </div>
      </div>
    </div>
  );
}

