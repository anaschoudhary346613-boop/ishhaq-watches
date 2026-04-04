import { createBrowserClient } from "@supabase/ssr";

// Standardizing to NEXT_PUBLIC_SUPABASE_ANON_KEY but allowing fallback for existing setup.
// Using placeholders during build to prevent crashes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 
                    "placeholder-key";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
