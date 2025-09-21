import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "fimanage-logo.jpg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Fimanage",
        short_name: "Fimanage",
        description: "A Financial Management System",
        theme_color: "#111827",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/fimanage-logo.jpg",
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: "/fimanage-logo.jpg",
            sizes: "512x512",
            type: "image/jpg",
          },
          {
            src: "/fimanage-logo.jpg",
            sizes: "512x512",
            type: "image/jpg",
            purpose: "any maskable",
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
