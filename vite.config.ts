/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import { ohImage } from "./src/plugin";

export default defineConfig({
  root: "./playground",
  plugins: [ohImage(), react()],
  test: {
    root: ".",
    // Default to Node environment
    environment: "node",
    // Browser config (enable with @vitest-environment browser in test files)
    browser: {
      enabled: false, // Not enabled by default
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
    },
  },
});
