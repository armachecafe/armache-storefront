/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.armachecafe.com', pathname: '/catalog/**' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.armachecafe.com',
    NEXT_PUBLIC_COGNITO_POOL_ID: 'us-east-1_jw3PdJZAN',
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
  },
};

module.exports = nextConfig;
