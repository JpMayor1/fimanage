import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
