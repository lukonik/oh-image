/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { Image } from "./image";

export function __imageFactory(defaultProps: any) {
  return (props: any) => {
    return <Image {...defaultProps} {...props} />;
  };
}