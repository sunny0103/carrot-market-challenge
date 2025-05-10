import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  },
  env: {
    COOKIE_PASSWORD: process.env.COOKIE_PASSWORD
  }
}
 
export default nextConfig