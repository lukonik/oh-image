# Oh Image

The missing `<Image />` component for Vite and React.

For full documentation, visit [docs](https://lukonik.github.io/oh-image).

## Installation

```bash
npm install @lonik/oh-image sharp --save
```

## Usage

### 1. Register the Vite plugin

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ohImage } from "@lonik/oh-image/plugin";

export default defineConfig({
  plugins: [react(), ohImage()],
});
```

### 2. Use the Image component

```tsx
import { Image } from "@lonik/oh-image/react";
import heroImg from "./hero.jpg?oh";

function App() {
  return <Image src={heroImg} alt="Hero" />;
}
```
## License

[MIT](./LICENSE)
