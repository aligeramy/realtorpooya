/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve modern formats: a ~800KB JPEG original becomes a ~40-60KB AVIF/WebP.
    formats: ['image/avif', 'image/webp'],
    // Hold optimized variants at the edge for 31 days. Without a long TTL the
    // optimizer re-fetches the full-resolution original from Supabase Storage
    // on every cache miss, which is what made egress expensive.
    minimumCacheTTL: 2678400,
    // Widths actually used by this site. Trimming the default ladder avoids
    // generating (and paying to fetch originals for) sizes nothing requests.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ktbfuijzvgbzfoodraza.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      { protocol: 'https', hostname: 'trreb-image.ampre.ca' },
      { protocol: 'https', hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'realtorpooya.ca' },
      { protocol: 'https', hostname: 'www.realtorpooya.ca' },
      { protocol: 'https', hostname: 'realtorpooya.com' },
      { protocol: 'https', hostname: 'www.realtorpooya.com' },
      { protocol: 'https', hostname: 'search.realtorpooya.com' },
      { protocol: 'https', hostname: 'bridlepathestate.com' },
      { protocol: 'https', hostname: 'www.bridlepathestate.com' },
      { protocol: 'https', hostname: 'thebedfordyorkville.com' },
    ],
  },
}

export default nextConfig
