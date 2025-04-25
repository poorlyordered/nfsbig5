const createNextIntlPlugin = require('next-intl/plugin');
// const { withContentlayer } = require('next-contentlayer'); // Removed contentlayer wrapper

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any other Next.js configurations here if needed
  // For example, to handle images from external sources if your markdown includes them:
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'example.com', // Add hostnames for external images
  //     },
  //   ],
  // },
};

// module.exports = withContentlayer(withNextIntl(nextConfig)); // Removed contentlayer wrapper
module.exports = withNextIntl(nextConfig); // Export config wrapped only with next-intl
