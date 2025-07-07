import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  watchOptions: {
    pollIntervalMs: 1000
  },
  turbopack: {
    rules: {
      '*.svg': { loaders: [{ loader: '@svgr/webpack', options: { icon: true, fill: 'currentColor' } }], as: '*.js' },
    },
  },
}

export default nextConfig
