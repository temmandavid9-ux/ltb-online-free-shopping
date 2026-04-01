import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ltb-online-free-shopping',
  // ADD THIS SECTION BELOW
  trailingSlash: true, 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.firebasestorage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ibb.co', pathname: '/**' }
    ],
  },
};

export default nextConfig;