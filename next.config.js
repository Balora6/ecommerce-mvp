/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handle Prisma client generation
  serverExternalPackages: ["@prisma/client"],
};

module.exports = nextConfig;
