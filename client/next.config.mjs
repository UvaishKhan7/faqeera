/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the new function we are adding.
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match any path starting with /api/
        destination: 'http://localhost:5001/api/:path*', // And forward it to our backend
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