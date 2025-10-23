import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import ViteImagemin from "vite-plugin-imagemin";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Automatically update the service worker
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,woff2}"], // Cache these file types
      },
      manifest: {
        name: "Fimanage", // Customize the name of your PWA
        short_name: "Fimanage", // Short name for your PWA
        description: "A financial management progressive web app",
        theme_color: "#ffffff", // White
        background_color: "#ffffff", // White
        display: "standalone", // Set the display mode (can be fullscreen, standalone, etc.)
        icons: [
          {
            src: "/fimanage-logo.jpg", // Path to the PWA icon (must be present in your assets)
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: "/fimanage-logo.jpg",
            sizes: "512x512",
            type: "image/jpg",
          },
        ],
      },
    }),
    ViteImagemin({
      optipng: {
        optimizationLevel: 7, // Highest compression for PNG images
      },
      mozjpeg: {
        quality: 80, // Compression quality for JPEGs
      },
      svgo: {
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {
      VITE_APP_ENV: JSON.stringify(process.env.VITE_APP_ENV),
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
    },
  },
});
