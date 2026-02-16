import { createFileRoute } from "@tanstack/react-router";
import { ImgproxyPlayground } from "../components/ImgproxyPlayground";

export const Route = createFileRoute("/imgproxy")({
  component: ImgproxyPlayground,
});
