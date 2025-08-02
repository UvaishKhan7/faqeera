/** @type {import('next').NextConfig} */
const nextConfig = {
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
      new URL('https://res.cloudinary.com/**'),
      new URL('https://fakestoreapi.com/**'),
    ],
  },
};

export default nextConfig;
