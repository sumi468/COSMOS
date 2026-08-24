/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Type-checking still runs during `next build`; lint separately with
    // `npm run lint` so a first-time ESLint config prompt never blocks CI.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.nasa.gov' },
      { protocol: 'https', hostname: 'images-assets.nasa.gov' },
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      { protocol: 'https', hostname: '**.jaxa.jp' },
      { protocol: 'https', hostname: 'global.jaxa.jp' },
      { protocol: 'https', hostname: '**.thespacedevs.com' },
      { protocol: 'https', hostname: 'thespacedevs-prod.nyc3.digitaloceanspaces.com' }
    ]
  }
};
export default nextConfig;
