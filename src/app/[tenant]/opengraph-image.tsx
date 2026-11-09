import { ImageResponse } from "next/og";
import { getTenantBySlug } from "@/services/tenant.service";
import { DEFAULT_ACCENT_COLOR, DEFAULT_PRIMARY_COLOR } from "@/entities/tenant/schema";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);

  const businessName = tenant?.brand.name ?? "Premier Residential Cleaning";
  const city = tenant?.brand.location.city ?? "Metro Area";
  const state = tenant?.brand.location.state ?? "US";
  const tagline = tenant?.brand.tagline ?? "Five-Star Professional House Cleaning";
  const rating = tenant?.trust.googleRating ?? 4.9;
  const reviewCount = tenant?.trust.googleReviewCount ?? 150;
  const primaryColor = tenant?.brand.themeOverrides?.primaryColor ?? DEFAULT_PRIMARY_COLOR;
  const accentColor = tenant?.brand.themeOverrides?.accentColor ?? DEFAULT_ACCENT_COLOR;
  const initial = businessName.charAt(0);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F172A",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            backgroundColor: primaryColor,
            opacity: 0.25,
            filter: "blur(90px)",
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 10,
          }}
        >
          {/* Logo Badge & Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                backgroundColor: primaryColor,
                color: "#FFFFFF",
                fontSize: "32px",
                fontWeight: 900,
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              }}
            >
              {initial}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.5px",
                }}
              >
                {businessName}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: accentColor,
                }}
              >
                {city}, {state} • Verified Service Provider
              </span>
            </div>
          </div>

          {/* Google Review Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "10px 20px",
              borderRadius: "14px",
            }}
          >
            <span style={{ color: "#F59E0B", fontSize: "20px" }}>★</span>
            <span style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700 }}>
              {rating} ({reviewCount}+ Reviews)
            </span>
          </div>
        </div>

        {/* Center Main Punchline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "920px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#25D366",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#25D366",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Instant Online Dispatch Portal
            </span>
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-1.5px",
            }}
          >
            {tagline}
          </h1>
        </div>

        {/* Bottom Trust & CTA Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            zIndex: 10,
          }}
        >
          {/* Trust Highlights */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#94A3B8" }}>
              ✓ $2M Commercial Liability
            </span>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#94A3B8" }}>
              ✓ Background-Checked Staff
            </span>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#94A3B8" }}>
              ✓ 100% Sparkle Guarantee
            </span>
          </div>

          {/* Virtual CTA Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              padding: "14px 26px",
              borderRadius: "14px",
              fontSize: "17px",
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span>Instant Quote in 60s →</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
