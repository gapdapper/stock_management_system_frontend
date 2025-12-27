import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const root = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
