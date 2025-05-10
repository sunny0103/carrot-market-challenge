import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  },
  env: {
    COOKIE_PASSWORD: process.env.COOKIE_PASSWORD || 
      'development_cookie_password_that_is_at_least_32_characters'
  }
}

export default nextConfig