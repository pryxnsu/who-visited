import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  devIndicators: process.env.NODE_ENV === 'production' ? false : { position: 'bottom-left' },
  reactCompiler: true,
  output: 'standalone',
};

export default nextConfig;
