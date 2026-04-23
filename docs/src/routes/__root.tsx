import { PrestigeShell, type PrestigeShellProps } from "@lonik/prestige/ui";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import config from "virtual:prestige/config";
import appCss from "../styles.css?url";

const siteUrl = "https://lukonik.github.io/oh-image";
const siteTitle = "oh-image";
const siteDescription = `
Oh Image is an image component library for React and Vite apps. It ships with a lightweight yet powerful Image component plus a Vite optimizer plugin that automatically optimizes static assets.
`;
const siteImage = `${siteUrl}/logo.png`;

const options: PrestigeShellProps = {
  customHeaderTitle: () => (
    <span className="font-rubik text-primary-600 text-2xl">Oh Image</span>
  ),
  copyright: () => (
    <a
      className="underline"
      href="https://github.com/lukonik/Prestige"
      target="_blank"
      rel="noreferrer"
    >
      Built with Prestige 🎩
    </a>
  ),
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: config.title },
      { name: "application-name", content: config.title },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: config.title },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: config.title },

      { property: "og:locale", content: "en_US" },
      { property: "og:title", content: siteTitle },
      { property: "og:description", content: siteDescription },
      { property: "og:image", content: siteImage },
      { property: "og:image:alt", content: "Themer logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteTitle },
      { name: "twitter:description", content: siteDescription },
      { name: "twitter:image", content: siteImage },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/oh-image/favicon.svg" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PrestigeShell options={options}>
          <Outlet />
        </PrestigeShell>
        <Scripts />
      </body>
    </html>
  ),
});
