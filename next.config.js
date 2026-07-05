/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production builds (S3/CloudFront deployment).
  // In dev/test mode, use standard Next.js server for proper dynamic route support.
  ...(process.env.NODE_ENV === 'production' && !process.env.NEXT_DEV_SERVER
    ? { output: 'export' }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.armachecafe.com', pathname: '/catalog/**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com',
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: 'us-east-1_jw3PdJZAN',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '780qhrdegeu08g7nlb81bqpuvv',
  },
  trailingSlash: true,
};

module.exports = nextConfig;
