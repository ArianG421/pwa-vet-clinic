export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lets pages/middleware degrade gracefully (instead of crashing) before
// real Supabase credentials are added to .env.local.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Explicit (rather than relying on @supabase/ssr's implicit defaults) so the
// "stay signed in on this device" cookie survives browser/app restarts:
// maxAge is already the library default (400 days, the Chrome cap), but
// `secure` isn't set by default — set it ourselves so it's never accidentally
// silent-dropped in production.
export const supabaseCookieOptions = {
  maxAge: 60 * 60 * 24 * 400,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
