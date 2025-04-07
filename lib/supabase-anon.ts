import { createClient } from "@supabase/supabase-js";

// Create a Supabase client with anonymous access that doesn't rely on cookies
// This is specifically for public data like leaderboards
export function createAnonSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
