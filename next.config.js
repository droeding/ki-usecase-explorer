/** @type {import('next').NextConfig} */
// Note: Wasp manages Next.js configuration internally
// This file is only for Wasp-specific overrides

const nextConfig = {
  // Wasp handles most configuration automatically
  // Only add custom overrides here if absolutely necessary
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  
  // Headers for security (if not handled by Wasp)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
