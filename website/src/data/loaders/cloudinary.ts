export const cloudinary = {
  slug: "cloudinary",
  name: "Cloudinary",
  title: "Cloudinary Loader",
  urlSchema: "https://res.cloudinary.com/<cloudName>/image/upload/<transformations>/<publicId>",
  defaults: `
  {
    // By default, no transforms are applied unless specified.
    // However, if no transforms are provided, the loader applies:
    // format('auto')
    // quality('auto')
    
    // For placeholders:
    // width(10)
    // quality('auto:low')
    // format('auto')
  }
  `,
  link: "https://cloudinary.com/documentation/transformation_reference",
  interface: `
import type { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";

export type CloudinaryTransforms = (img: CloudinaryImage) => CloudinaryImage;

export type CloudinaryGlobalOptions = {
  cld: Cloudinary;
};

export interface CloudinaryLoaderHookOptions {
  transforms?: CloudinaryTransforms;
  placeholder?: CloudinaryTransforms;
}

export interface CloudinaryLoaderProviderProps {
  client: Cloudinary;
  children: React.ReactNode;
  transforms?: CloudinaryTransforms;
  placeholder?: CloudinaryTransforms;
}
`,
  usageCode: `
import { Cloudinary } from "@cloudinary/url-gen";
import { sepia } from "@cloudinary/url-gen/actions/effect";
import { useCloudinaryLoader } from "@lonik/oh-image/loaders/cloudinary";
import { Image } from "@lonik/oh-image/react";

const cld = new Cloudinary({
  cloud: {
    cloudName: "demo",
  },
});

function MyComponent() {
  // You can pass transforms directly to the hook
  const loader = useCloudinaryLoader((img) => img.effect(sepia()));

  return (
    <Image
      loader={loader}
      src="sample"
      width={300}
      alt="My Image"
    />
  );
}
`,
  providerCode: `
import { Cloudinary } from "@cloudinary/url-gen";
import { CloudinaryLoaderProvider } from "@lonik/oh-image/loaders/cloudinary";

const cld = new Cloudinary({
  cloud: {
    cloudName: "demo",
  },
});

function App() {
  return (
    <CloudinaryLoaderProvider 
      client={cld}
      // Optional: Default transforms for all images
      transforms={(img) => img.quality('auto')}
    >
      <MyComponent />
    </CloudinaryLoaderProvider>
  );
}
`
};