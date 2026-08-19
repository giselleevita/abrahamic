import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * `frame-src` is the load-bearing one for this app: video embeds interpolate a
 * stored id into an iframe URL, so even though that id is regex-validated at
 * both write and render time, the CSP confines any frame that does load to the
 * privacy-preserving YouTube domain.
 *
 * `unsafe-inline`/`unsafe-eval` remain in `script-src` because Next injects
 * inline bootstrap scripts; tightening that needs nonce plumbing through the
 * root layout and is its own piece of work.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  // Only the no-cookie player may be framed — not youtube.com itself.
  "frame-src https://www.youtube-nocookie.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
