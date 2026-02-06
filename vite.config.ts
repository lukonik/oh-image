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
    projects: [
      {
        test: {
          include: ["tests/browser/*.test.{ts,tsx}"],
          // Browser tests configuration
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            headless: true,
          },
        },
      },
    ],
  },
});
