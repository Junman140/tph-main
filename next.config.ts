import { NextConfig } from 'next';
import createMDX from '@next/mdx';

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
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  turbo: {
    enabled: true, // ✅ Official way now
  },
};

const withMDX = createMDX({});
export default withMDX(nextConfig);
