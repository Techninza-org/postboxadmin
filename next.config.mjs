/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/admin',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        // port: '',
        // pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: 'postboxmaps.s3.ap-south-1.amazonaws.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },

};

export default nextConfig;
