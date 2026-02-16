import { createFileRoute } from "@tanstack/react-router";
import { CloudflarePlayground } from "../components/CloudflarePlayground";

export const Route = createFileRoute("/cloudflare")({
  component: CloudflarePlayground,
});
