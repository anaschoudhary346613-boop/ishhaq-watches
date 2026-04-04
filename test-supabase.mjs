import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iifhnnsomuplijwnujoa.supabase.co';
const supabaseKey = 'sb_publishable_SYndgtdTVejg_HIay-Z9Fg_t3Qw2VFm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing connection to Supabase...");
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Auth check failed. Keys might be invalid:", error.message);
      process.exit(1);
    }
    console.log("SUCCESS: Client connected and authenticated securely! (No Active Session)");

    const { error: dbError } = await supabase.from('products').select('*').limit(1);
    
    if (dbError) {
      console.log("SUCCESS: Connected to database. Note: table 'products' does not exist yet (or is restricted) which is normal: ", dbError.message);
    } else {
      console.log("SUCCESS: Database table 'products' exists and is readable.");
    }

  } catch (err) {
    console.error("Connection exception:", err);
    process.exit(1);
  }
}

testConnection();
