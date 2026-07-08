import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/branch/",
  plugins: [react(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
});