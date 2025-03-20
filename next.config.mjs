/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'media.istockphoto.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
        pathname: '/uploads/images/**',
      },
    ],
  },
};

export default nextConfig;
