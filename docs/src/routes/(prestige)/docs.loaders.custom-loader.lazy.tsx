import { ContentRoute } from "@lonik/prestige/ui";
import { createLazyFileRoute } from "@tanstack/react-router";
import * as contentData from "virtual:prestige/content/docs/loaders/custom-loader";

export const Route = createLazyFileRoute('/(prestige)/docs/loaders/custom-loader')(ContentRoute(contentData));
