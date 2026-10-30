import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_STATIC_SITE === "true" ? "/k-expression-learner/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3300",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
});
