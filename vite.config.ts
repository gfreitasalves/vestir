/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages (project site) serves the app under /vestir/, not /.
// Only applied to the dedicated `build:pages` script (--mode github-pages),
// so the regular `dev`/`build`/`preview` flow (and e2e tests against it)
// keeps serving from root.
export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? "/vestir/" : "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.tsx"],
  },
}));
