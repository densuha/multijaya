import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Tambahkan konfigurasi websocket client untuk HMR
  experimental: {
    // Memaksa client HMR menggunakan host/port yang sesuai dengan browser Anda
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  },
  // Memastikan dev indicator tidak memblokir koneksi websocket di beberapa environment
  devIndicators: {
    appIsrStatus: false,
  }
};

export default nextConfig;