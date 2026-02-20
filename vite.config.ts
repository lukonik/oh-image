/// <reference types="vitest/config" />
import path from "node:path";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ohImage } from "./src/plugin";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import Inspect from "vite-plugin-inspect";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  root: "./playground",
  optimizeDeps: {
    include: ["@cloudinary/url-gen"],
  },
  plugins: [
    Inspect(),
    ohImage(),
    tsconfigPaths(),
    tailwindcss(),
    tanstackRouter({
      routesDirectory: path.resolve(__dirname, "./playground/src/routes"),
      generatedRouteTree: path.resolve(
        __dirname,
        "./playground/src/routeTree.gen.ts",
      ),
    }),
    react(),
  ],
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
          include: ["tests/browser/**/*.test.{ts,tsx}"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          chaiConfig: {
            truncateThreshold: 1000,
          },
        },
      },
    ],
  },
});
