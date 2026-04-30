import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*\.js$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-js-assets",
        },
      },
      {
        urlPattern: /^https?.*\.css$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-css-assets",
        },
      },
      {
        urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-images",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  /* config options here */
};

export default withPWA(nextConfig);
