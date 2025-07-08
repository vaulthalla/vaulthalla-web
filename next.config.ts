import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: 'http', hostname: '127.0.0.1', port: '36970', pathname: '/preview*' }] },
  turbopack: {
    rules: {
      '*.svg': { loaders: [{ loader: '@svgr/webpack', options: { icon: true, fill: 'currentColor' } }], as: '*.js' },
    },
  },
}

export default nextConfig
