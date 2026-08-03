export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lets pages/middleware degrade gracefully (instead of crashing) before
// real Supabase credentials are added to .env.local.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
