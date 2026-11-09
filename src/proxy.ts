import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { getTenantSlugByCustomDomain } from "@/services/tenant.service";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const pathname = url.pathname;

  // Normalize hostname without port
  const hostname = host.split(":")[0].toLowerCase();
  const rootDomain = (
    env.NEXT_PUBLIC_ROOT_DOMAIN ||
    (hostname.endsWith("localhost") ? "localhost" : "pristineclean.com")
  ).toLowerCase();

  let tenantSlug: string | null = null;
  let isCustomDomain = false;
  const isSystemPath = pathname.startsWith("/admin") || pathname.startsWith("/api");

  if (!isSystemPath) {
    // 1. Query parameter resolution for rapid testing (?tenant=slug)
    const queryTenant = url.searchParams.get("tenant");
    if (queryTenant) {
      tenantSlug = queryTenant.toLowerCase().trim();
    }
    // 2. Subdomain extraction (e.g. clean-apex.localhost or clean-apex.pristineclean.com)
    else if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
      const extractedSubdomain = hostname.replace(`.${rootDomain}`, "").trim();
      if (
        extractedSubdomain &&
        extractedSubdomain !== "www" &&
        extractedSubdomain !== "admin" &&
        extractedSubdomain !== "api"
      ) {
        tenantSlug = extractedSubdomain;
      }
    } else if (
      hostname !== rootDomain &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1" &&
      !hostname.endsWith(".localhost") &&
      !hostname.endsWith(".vercel.app") &&
      !hostname.startsWith("admin.")
    ) {
      isCustomDomain = true;
      tenantSlug = await getTenantSlugByCustomDomain(hostname);
    }
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://*.public.blob.vercel-storage.com https://res.cloudinary.com;
    font-src 'self' data:;
    connect-src 'self' https://*.neon.tech https://*.vercel.app https://*.upstash.io;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const applySecurityHeaders = (res: NextResponse) => {
    res.headers.set("Content-Security-Policy", cspHeader);
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), browsing-topics=()"
    );
    if (process.env.NODE_ENV === "production") {
      res.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
    }
    return res;
  };

  // Perform internal rewrite if a tenant target was identified
  if (
    tenantSlug &&
    !pathname.startsWith(`/${tenantSlug}`) &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api")
  ) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-slug", tenantSlug);
    if (isCustomDomain) {
      requestHeaders.set("x-custom-domain", hostname);
    }

    url.pathname = `/${tenantSlug}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });

    return applySecurityHeaders(response);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
