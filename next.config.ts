import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.sanity.io',
        protocol: 'https',
      },
      {
        hostname: 'img.clerk.com',
        protocol: 'https',
      },
    ],
  },
  // Fix for Vercel deployment issues with Next.js 15
  serverExternalPackages: ['@sanity/client'],
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-progress',
      '@radix-ui/react-dropdown-menu',
      'lucide-react',
    ],
  },
  // Ensure proper build process
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Docker optimization
  output: 'standalone',
  async redirects() {
    return [];
  },
};

export default nextConfig;
