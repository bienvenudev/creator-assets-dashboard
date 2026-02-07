import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "happy-dom", // jsdom is not working with vitest, so we use happy-dom instead? why?
    setupFiles: "./src/test/setup.ts",
  },
});
