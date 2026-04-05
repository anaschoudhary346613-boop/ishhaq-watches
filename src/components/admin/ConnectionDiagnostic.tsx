"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

export function ConnectionDiagnostic() {
  const [status, setStatus] = useState<"idle" | "checking" | "connected" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const checkConnection = async () => {
    setStatus("checking");
    try {
      // Test 1: Simple DB fetch
      const { error: dbError } = await supabase.from("products").select("count", { count: "exact", head: true });
      if (dbError) throw new Error(`Database: ${dbError.message}`);

      // Test 2: Check Bucket Accessibility
      // We try to list the bucket which requires the key to be valid and bucket to exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("product-images");
      
      if (bucketError) {
        if (bucketError.message.includes("not found")) {
          throw new Error("Storage: Bucket 'product-images' not found. Please create it in Supabase.");
        }
        throw new Error(`Storage: ${bucketError.message}`);
      }

      setStatus("connected");
    } catch (err: any) {
      console.error("Diagnostic failed:", err);
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className={`mb-6 p-4 rounded-lg border flex items-center justify-between transition-colors ${
      status === "connected" ? "bg-green-50 border-green-100" : 
      status === "error" ? "bg-red-50 border-red-100" : 
      "bg-gray-50 border-gray-100"
    }`}>
      <div className="flex items-center gap-3">
        {status === "checking" && <Activity className="w-5 h-5 text-gray-400 animate-pulse" />}
        {status === "connected" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        {status === "error" && <ShieldAlert className="w-5 h-5 text-red-500" />}
        
        <div className="space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#121c2d]">
            {status === "checking" ? "Checking Connection..." : 
             status === "connected" ? "Connection Established" : 
             status === "error" ? "Connection Issue Detected" : "System Status"}
          </p>
          <p className="text-[10px] text-gray-500">
            {status === "connected" ? "Ready for inventory management & image uploads." : 
             status === "error" ? errorMsg : "Initializing Supabase link..."}
          </p>
        </div>
      </div>

      {(status === "error" || status === "connected") && (
        <button 
          onClick={checkConnection}
          className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors"
        >
          Check Again
        </button>
      )}
    </div>
  );
}
