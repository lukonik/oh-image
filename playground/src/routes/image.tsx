import { createFileRoute } from "@tanstack/react-router";
import { ImagePlayground } from "../components/ImagePlayground";

export const Route = createFileRoute("/image")({
  component: ImagePlayground,
});
