/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer, defaultLoaders }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
