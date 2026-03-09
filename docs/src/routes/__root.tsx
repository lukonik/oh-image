import { createPrestigeRootRoute } from "@lonik/prestige/ui";

import appCss from "../styles.css?url";

export const Route = createPrestigeRootRoute({
  appCss: appCss,
  title: "Prestige",
  favicon: "/favicon.svg",
});
