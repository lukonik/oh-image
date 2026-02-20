# @lonik/oh-image

## Project Overview

`@lonik/oh-image` is a comprehensive image optimization solution for React applications built with Vite. It consists of two main parts:

1.  **Vite Plugin:** A build-time (and dev-server) plugin that automatically processes imported images using `sharp`. It generates responsive image variants (srcsets), low-quality placeholders (blur-up), and optimized formats (WebP, AVIF) on the fly.
2.  **React Component:** An `<Image />` component that seamlessly integrates with the plugin's output to provide a polished user experience with lazy loading, layout shift prevention, and art direction support.

The project also includes adapters (loaders) for various external image CDNs like Cloudflare, Cloudinary, Contentful, and others.

## Architecture

*   **`src/plugin/`**: Contains the Vite plugin logic.
    *   Intercepts image imports ending in `?$oh` (configurable).
    *   Uses `sharp` to process images.
    *   Manages a cache of processed images in `node_modules/.cache`.
    *   Generates code that exports image metadata (src, srcset, width, height, placeholder) for the React component.
*   **`src/react/`**: Contains the React component library.
    *   Exports the `<Image />` component.
    *   Handles props like `fill`, `priority`, and style composition.
    *   Uses `useImgLoaded` hook to manage loading states and placeholder transitions.
*   **`src/loaders/`**: Contains loader implementations for external image services.
*   **`playground/`**: A Vite-based React application used for testing and demonstrating the library's features during development.
*   **`website/`**: Documentation site built with Astro.

## Key Files

*   `package.json`: Project configuration, scripts, and dependencies.
*   `tsdown.config.ts`: Configuration for `tsdown`, which is used to build the library.
*   `vite.config.ts`: Configuration for the playground/dev environment.
*   `src/plugin/plugin.ts`: The main entry point for the Vite plugin.
*   `src/react/image.tsx`: The source code for the `<Image />` React component.

## Development

### Prerequisites

*   Node.js (LTS recommended)
*   pnpm (implied by `pnpm-lock.yaml`)

### Scripts

*   `pnpm install`: Install dependencies.
*   `pnpm run dev`: Build the library in watch mode.
*   `pnpm run build`: Build the library for production using `tsdown`.
*   `pnpm run play`: Start the playground app (Vite dev server) to test changes interactively.
*   `pnpm run test`: Run unit tests using `vitest`.
*   `pnpm run typecheck`: Run TypeScript type checking.
*   `pnpm run release`: Release a new version (bumps version, publishes).

### Common Tasks

*   **Adding a feature to the React component:** Edit `src/react/image.tsx` and verify in the playground.
*   **Modifying image processing logic:** Edit `src/plugin/` files. You may need to restart the playground server to pick up plugin changes.
*   **Running the Playground:**
    1.  Run `pnpm run play`.
    2.  Open the local URL provided by Vite.
    3.  Edit files in `playground/src` to test different scenarios.

## Conventions

*   **Code Style:** Prettier and ESLint are configured.
*   **Testing:** Vitest is used for testing. Tests are located in the `tests/` directory.
*   **Typing:** The project is written in TypeScript. Ensure strict type checking passes (`pnpm run typecheck`).
*   **Commits:** The project uses Conventional Commits (enforced by `commitlint`).

## Usage Example (Consumer)

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ohImage } from "@lonik/oh-image/plugin";

export default defineConfig({
  plugins: [react(), ohImage()],
});
```

```tsx
// App.tsx
import { Image } from "@lonik/oh-image/react";
import myImg from "./my-image.jpg?$oh"; // Import with ?$oh to trigger processing

function App() {
  return <Image src={myImg} alt="My optimized image" />;
}
```
