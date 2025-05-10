import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  // }
}
 
export default nextConfig
