
export interface ImageMetadata {
  width: number;
  height: number;
  src: string;
  blur?: string;
  srcsets: ImageSrcSet[];
}

export interface ImageSrcSet {
  src: string;
}
