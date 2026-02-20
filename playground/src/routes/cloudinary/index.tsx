import { createFileRoute } from "@tanstack/react-router";
import { useCloudinaryLoader } from "@lonik/oh-image/cloudinary";
import { Image } from "@lonik/oh-image/react";
import { sepia } from "@cloudinary/url-gen/actions/effect";

export const Route = createFileRoute("/cloudinary/")({
  component: RouteComponent,
});

function RouteComponent() {
  const loader = useCloudinaryLoader();
  const sepiaLoader = useCloudinaryLoader((img) => img.effect(sepia()));

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col gap-4 border-b border-gray-300 pb-8">
        <h2 className="text-xl font-bold">Default Loader</h2>
        <Image
          className="w-[500px]"
          width={500}
          src={"cld-sample"}
          alt="Cloudinary Default"
          loader={loader}
        />
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-300 pb-8">
        <h2 className="text-xl font-bold">Sepia Effect Loader</h2>
        <Image
          className="w-[500px]"
          width={500}
          src={"cld-sample"}
          alt="Cloudinary Sepia"
          loader={sepiaLoader}
        />
      </div>
    </div>
  );
}