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
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
        pathname: "/**",
      }
    ],
  },
  pageExtensions: ["ts", "tsx"],
 
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {}
  },
  // Disable static optimization to prevent prerendering issues
  trailingSlash: false,
  skipTrailingSlashRedirect: true
};

 

export default nextConfig;
