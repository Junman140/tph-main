import { NextConfig } from 'next';
// import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "seo-heist.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dwdwn8b5ye.ufs.sh",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ansubkhan.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      }
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],

  // Add TypeScript error handling
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {}
  },
  // Disable static optimization for pages with client components
  trailingSlash: false,
  skipTrailingSlashRedirect: true
};

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [],
//     rehypePlugins: [],
//   },
// });

export default nextConfig;
