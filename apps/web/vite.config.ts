import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@chariot/types": path.resolve(__dirname, "../../packages/types/src"),
      "@chariot/kernel": path.resolve(__dirname, "../../packages/kernel/src"),
      "@chariot/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@chariot/board": path.resolve(__dirname, "../../packages/board/src"),
      "@chariot/workbench": path.resolve(__dirname, "../../packages/workbench/src"),
    },
  },
});
