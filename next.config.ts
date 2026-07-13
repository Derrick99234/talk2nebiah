import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://checkout.paystack.com https://ui-avatars.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://paystack.com https://checkout.paystack.com",
              "font-src 'self' https://fonts.gstatic.com https://paystack.com https://checkout.paystack.com",
              "img-src 'self' data: blob: https://ui-avatars.com https://*.whatsapp.net https://paystack.com https://checkout.paystack.com",
              "connect-src 'self' https://ipapi.co https://api.paystack.co https://checkout.paystack.com https://graph.facebook.com https://api.openai.com",
              "frame-src https://standard.paystack.com https://checkout.paystack.com",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
