interface ImageSrc {
  /** Original width of the source image in pixels */
  width: number;
  /** Original height of the source image in pixels */
  height: number;
  /** URL to the placeholder image (if placeholder was enabled) */
  placeholderUrl?: string;
  /** Array of responsive image sources at different breakpoints */
  srcSets: string;
  /** URL to the main processed image */
  src: string;
}

declare module "*?oh" {
  const imageSrc: any;
  export default imageSrc;
}
