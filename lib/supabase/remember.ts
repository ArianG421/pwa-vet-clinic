const KEY = "willowbrook-remember-me";

// Supabase's SDK always writes its own long-lived session cookie regardless
// of what maxAge we configure (confirmed in @supabase/ssr's storage code —
// it hardcodes its own default on every write), so "don't remember me"
// can't be implemented by shortening that cookie. Instead this flag drives
// SessionGuard: if unchecked, sign out client-side when the tab/app closes.
export function setRememberMe(remember: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, remember ? "1" : "0");
}

export function getRememberMe(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(KEY) !== "0";
}
