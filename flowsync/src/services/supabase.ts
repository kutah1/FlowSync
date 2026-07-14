import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client. The anon key is public by design — every table
 * is protected by RLS (see src/supabase/), so a user can only ever read or
 * write their own rows.
 *
 * The service-role key must NEVER appear in this app. It bypasses RLS, and
 * anything in a Vite bundle is readable by the user.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.",
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
