# @lonik/oh-image

A React component library and Vite plugin for optimized image handling. This project provides a seamless workflow for importing, processing, and displaying images in React applications with automatic optimization features like format conversion, responsive `srcSet` generation, and lazy loading placeholders.

## Project Overview

*   **Type:** Library (Vite Plugin + React Component)
*   **Language:** TypeScript
*   **Core Dependencies:** `sharp` (image processing), `vite` (bundler/plugin), `react` (UI).
*   **Package Manager:** `pnpm` (inferred from `pnpm-lock.yaml`)

## Key Features

*   **Vite Plugin (`oh-image`):**
    *   intercepts image imports via `?oh` query parameter.
    *   Uses `sharp` to resize, format (default: WebP), and optimize images.
    *   Automatically generates multiple breakpoints for responsive `srcSet`.
    *   Generates low-quality placeholders (blurred) for lazy loading.
    *   Exports a structured object containing `src`, `width`, `height`, `srcSet`, and `placeholderUrl` instead of a simple string.
*   **React Component (`<Image />`):**
    *   Accepts the structured image object from the plugin.
    *   **`priority` prop:** Enables eager loading, high fetch priority, and `link rel="preload"` (React 19+ compatible).
    *   **`fill` prop:** Configures the image to fill its container (absolute positioning).
    *   **Placeholder:** Automatically applies a blurred background placeholder if available.

## Usage Concepts

### 1. Configuration (Vite)
Add the plugin to `vite.config.ts`:
```typescript
import { ohImage } from "@lonik/oh-image/plugin";

export default {
  plugins: [
    ohImage({
      /* options: distDir, bps, format, placeholder */
    })
  ]
}
```

### 2. Importing Images
Import images with the `?oh` query to trigger optimization:
```typescript
import myImage from "./assets/photo.jpg?oh&width=800&placeholder=true";
```

### 3. Using the Component
```tsx
import { Image } from "@lonik/oh-image/react";
import myImage from "./assets/photo.jpg?oh";

export function App() {
  return <Image src={myImage} alt="Optimized Photo" />;
}
```

## Development Workflow

### Scripts
*   **Install Dependencies:** `pnpm install`
*   **Start Playground:** `pnpm play` (Runs a Vite dev server in `playground/` to test changes)
*   **Run Tests:** `pnpm test` (Runs Vitest for unit and server tests)
*   **Build Library:** `pnpm build` (Uses `tsdown` to bundle `src/` to `dist/`)
*   **Type Check:** `pnpm run typecheck`
*   **Lint:** inferred `eslint` usage via `package.json`

### Project Structure
*   `src/plugin/`: Contains the Vite plugin logic.
    *   `index.ts`: Entry point.
    *   `plugin.ts`: Core plugin implementation (dev server middleware, load hooks, bundle generation).
    *   `utils.ts`: Helper functions for `sharp` processing and query parsing.
*   `src/react/`: Contains the React component.
    *   `image.tsx`: The `<Image />` component implementation.
*   `playground/`: A standalone Vite app for testing and demonstrating the library during development.
*   `tests/`: Vitest test suites (browser and server).
*   `website/`: Documentation site (Astro).

## Testing
The project uses **Vitest** for testing.
*   **Server/Plugin Tests:** located in `tests/server/`.
*   **Browser/Component Tests:** located in `tests/browser/` (using `@vitest/browser-playwright`).
