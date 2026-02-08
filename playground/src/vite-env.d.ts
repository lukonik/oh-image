/// <reference types="vite/client" />

declare module "*?oh" {
  import type { ImageSrc } from "../../src/react/types";
  const src: ImageSrc;
  export default src;
}

declare module "*?oh&placeholder=true" {
  import type { ImageSrc } from "../../src/react/types";
  const src: ImageSrc;
  export default src;
}

declare module "*?oh&placeholder=true&blur=10" {
  import type { ImageSrc } from "../../src/react/types";
  const src: ImageSrc;
  export default src;
}
