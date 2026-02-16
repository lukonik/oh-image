import { createFileRoute } from "@tanstack/react-router";
import { CloudinaryPlayground } from "../components/CloudinaryPlayground";

export const Route = createFileRoute("/cloudinary")({
  component: CloudinaryPlayground,
});
