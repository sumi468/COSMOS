/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Type-checking still runs during `next build`; lint separately with
    // `npm run lint` so a first-time ESLint config prompt never blocks CI.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      // NASA article body images (content:encoded), verified via a live fetch
      // of https://www.nasa.gov/news-release/feed/
      { protocol: "https", hostname: "assets.science.nasa.gov" },
      // NASA Astronomy Picture of the Day — images are served from
      // apod.nasa.gov, not api.nasa.gov.
      { protocol: "https", hostname: "apod.nasa.gov" },
      // NASA Image and Video Library renditions (thumb/small/medium/large/orig)
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      // NASA's own site, for any enclosure/media images some feeds provide directly
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "science.nasa.gov" },
      // JAXA official press pages (og:image extracted when RSS itself has none)
      { protocol: "https", hostname: "global.jaxa.jp" },
      { protocol: "https", hostname: "www.jaxa.jp" },
      // Launch Library 2 (The Space Devs) launch/rocket images
      { protocol: "https", hostname: "thespacedevs-prod.nyc3.digitaloceanspaces.com" }
    ]
  }
};
export default nextConfig;
