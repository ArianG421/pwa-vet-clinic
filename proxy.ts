import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { isSupabaseConfigured, supabaseAnonKey, supabaseCookieOptions, supabaseUrl } from "@/lib/supabase/config";

const handleI18nRouting = createMiddleware(routing);

function stripLocale(pathname: string): { locale: string; rest: string } {
  const match = pathname.match(/^\/sv(\/|$)/);
  if (!match) return { locale: routing.defaultLocale, rest: pathname };
  const rest = pathname.slice(3) || "/";
  return { locale: "sv", rest };
}

function localize(pathname: string, locale: string) {
  return locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;
}

export async function proxy(request: NextRequest) {
  const { locale, rest } = stripLocale(request.nextUrl.pathname);
  const isPortal = rest.startsWith("/portal");
  const isCrm = rest.startsWith("/crm");

  if (!isSupabaseConfigured) {
    // Before real credentials are added, leave auth fully open rather than
    // locking everyone out of /portal and /crm — locale routing still runs.
    return handleI18nRouting(request);
  }

  let response = handleI18nRouting(request);

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = handleI18nRouting(request);
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if ((isPortal || isCrm) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = localize("/login", locale);
    url.searchParams.set("redirect", rest);
    return NextResponse.redirect(url);
  }

  if (isCrm && user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "staff") {
      const url = request.nextUrl.clone();
      url.pathname = localize("/portal", locale);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|images|sw.js|manifest.webmanifest|api|auth/callback).*)",
  ],
};
