/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ] },
      { source: '/runner-worker.js', headers: [{ key: 'Content-Security-Policy', value: "default-src 'none'; script-src 'unsafe-eval'; connect-src 'none'" }] },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
