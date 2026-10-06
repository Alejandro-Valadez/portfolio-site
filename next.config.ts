import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Next.js inlines small bootstrap scripts, so script-src needs 'unsafe-inline' unless every page moves to
// nonces, which would force dynamic rendering. Dev mode also needs eval.
const csp = [
  "default-src 'self'",
  // youtube.com serves the IFrame API the music player uses.
  `script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
