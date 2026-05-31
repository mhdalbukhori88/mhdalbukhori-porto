/** @type {import('next').NextConfig} */

// Security headers applied to every response. These harden the site against
// clickjacking, MIME sniffing, protocol downgrade, and limit what the page is
// allowed to load (Content-Security-Policy).
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains (works behind Cloudflare/Vercel).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Stop the page from being embedded in iframes (clickjacking protection).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't let browsers guess content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful APIs the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Restrict what resources can load. Tightened to this site + needed sources.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts + Google reCAPTCHA.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com",
      "img-src 'self' data: blob: https://www.gstatic.com https://www.google.com",
      "font-src 'self' data:",
      // Allow the form to call our own API, Resend, and reCAPTCHA verify.
      "connect-src 'self' https://api.resend.com https://www.google.com",
      // reCAPTCHA renders inside a Google iframe.
      "frame-src https://www.google.com https://recaptcha.google.com",
      "form-action 'self' https://wa.me mailto:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Hide the "X-Powered-By: Next.js" header (don't advertise the stack).
  poweredByHeader: false,
  images: {
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
