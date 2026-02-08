import type { ImageSrc } from "@lonik/oh-image/plugin";

declare module "*?oh" {
  const imageSrc: ImageSrc;
  export default imageSrc;
}
