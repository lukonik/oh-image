import { useState } from "react";
import image1 from "./car-1.avif";

function Image({
  src,
  blurUrl,
  alt,
  width,
  height,
}: {
  src: string;
  blurUrl: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onLoad={() => setIsLoaded(true)}
      sizes="100vw"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    />
  );
}

export function App() {
  console.log(image1);
  return (
    <div style={{ width: "600px" }}>
      <Image
        src={image1.src}
        blurUrl={image1.blur}
        alt="Image 1"
        width={image1.width}
        height={image1.height}
      />
      <h1>HELO</h1>
    </div>
  );
}
