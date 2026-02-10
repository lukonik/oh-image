/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
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
          include: ["tests/server/*.test.ts"],
          environment: "node",
          setupFiles: ["tests/server/setup.ts"],
        },
      },
      {
        test: {
          include: ["tests/browser/*.test.{ts,tsx}"],
          environment: "happy-dom",
        },
      },
    ],
  },
});
