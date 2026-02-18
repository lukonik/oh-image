/// <reference types="vitest/config" />
import path from "node:path";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ohImage } from "./src/plugin";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "./playground",
  plugins: [
    tsconfigPaths({
      logFile: true,
      projects: [path.resolve(__dirname, "tsconfig.playground.json")], // Explicitly point to the root config
    }),
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
