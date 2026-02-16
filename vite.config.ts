/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ohImage } from "./src/plugin";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./playground",
  resolve: {
    alias: {
      "@lonik/oh-image/react": path.resolve(__dirname, "./src/react/index.ts"),
    },
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({
      routesDirectory: path.resolve(__dirname, "./playground/src/routes"),
      generatedRouteTree: path.resolve(
        __dirname,
        "./playground/src/routeTree.gen.ts",
      ),
    }),
    ohImage(),
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
          include: ["tests/browser/*.test.{ts,tsx}"],
          environment: "happy-dom",
        },
      },
    ],
  },
});
