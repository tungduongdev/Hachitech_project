/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false; // 🔥 Tắt cache Webpack
    return config;
  }
};

export default nextConfig;
