/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow full-quality rendering for the profile portrait.
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
