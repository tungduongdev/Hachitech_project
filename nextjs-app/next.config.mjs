/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/dhxn4m04q/image/upload/**', // Định nghĩa đường dẫn cụ thể
    }],
  }
};

export default nextConfig;
