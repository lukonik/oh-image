// module declaration
declare module "*$oh" {
  export interface StaticImageProps extends Partial<
    Pick<
      ImgHTMLAttributes<HTMLImageElement>,
      | "fetchPriority"
      | "decoding"
      | "loading"
      | "className"
      | "sizes"
      | "style"
    >
  > {
    /** Alternative text for the image, required for accessibility. Use an empty string for decorative images. */
    alt: string;

    /** Configures the Image component to load the image immediately. */
    priority?: boolean;

    /**
     * Sets the image to "fill mode", which eliminates the height/width requirement and adds
     * styles such that the image fills its containing element.
     */
    fill?: boolean;

  }

  const component: React.FC<StaticImageProps>;
  export default component;
}
