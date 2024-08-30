/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
      async headers() {
        const apiDomain = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
        const cspValue = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://your-cdn.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://www.facebook.com https://connect.facebook.net https://accounts.google.com https://apis.google.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
          "font-src 'self' https://fonts.gstatic.com",
          `connect-src 'self' ${apiDomain} https://www.recaptcha.net https://www.facebook.com https://connect.facebook.net https://graph.facebook.com *`,
          "frame-src 'self' https://www.google.com https://www.recaptcha.net https://www.facebook.com *",
          "object-src 'none'",
          "upgrade-insecure-requests",
          "block-all-mixed-content",
        ].join('; ');
    
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: cspValue,
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
              {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin',
              },
            ],
          },
        ];
      },
      reactStrictMode: false,
}

module.exports = nextConfig
