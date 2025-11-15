/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wellfound.com",
      },
    ],
  },
};

export default nextConfig;
