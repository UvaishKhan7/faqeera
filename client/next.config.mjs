/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the new function we are adding.
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    return [
      {
        // ✅ Only rewrite API routes EXCEPT those starting with `/api/auth`
        source: '/api/:path((?!auth).*)',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: ' /*',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
      new URL('https://res.cloudinary.com/**'),
    ],
  },
};

export default nextConfig;
