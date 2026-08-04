"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getRememberMe } from "@/lib/supabase/remember";

// If the user unchecked "keep me signed in" at login, best-effort sign them
// out when they leave/close this tab or app. Mounted globally (not just on
// the login page) so the preference keeps applying across the whole visit.
export function SessionGuard() {
  useEffect(() => {
    function handlePageHide() {
      if (!getRememberMe()) {
        createClient().auth.signOut();
      }
    }
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  return null;
}
