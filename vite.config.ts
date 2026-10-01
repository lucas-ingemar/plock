import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  server: {
    allowedHosts: ["picard.local"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // "/auth": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   secure: false,
      // },
      // "/config": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      // },
      // "/info": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      // },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./frontend", import.meta.url)),
    },
  },
});
