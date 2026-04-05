/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@10-bla/domain-objects'],
};

module.exports = nextConfig;
