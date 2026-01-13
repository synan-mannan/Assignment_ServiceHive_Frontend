import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "https://synan-mannan.github.io/Assignment_ServiceHive_Frontend/",
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://assignment-servicehive-backend.onrender.com",
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
