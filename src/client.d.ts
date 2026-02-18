import type { FunctionComponent } from "react";

declare module "*?oh" {
  const component: FunctionComponent<{
    /** Alternative text for the image, required for accessibility. Use an empty string for decorative images. */
    alt: string;
    asap?: boolean;
    /** Configures the Image component to load the image immediately. */
    priority?: boolean;
    /** */
    src: string;

    /**
     * Sets the image to "fill mode", which eliminates the height/width requirement and adds
     * styles such that the image fills its containing element.
     */
    fill?: boolean;
  }>
  export default component;
}
