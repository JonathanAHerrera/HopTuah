/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  serverComponentsExternalPackages: ["@notionhq/client"],
};

export default nextConfig;
