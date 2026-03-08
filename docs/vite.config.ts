import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { prestige } from "@lonik/prestige/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const config = defineConfig({
  ssr: {
    noExternal: ["@lonik/prestige", "@lonik/themer"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    prestige({
      title: "Oh Image",
      collections: [
        {
          id: "docs",
          defaultLink: "docs/introduction",
          items: [
            { label: "Introduction", slug: "docs/introduction" },
            { label: "Installation", slug: "docs/installation" },
            { label: "Typescript", slug: "docs/typescript" },
            {
              label: "Image",
              slug: "docs/image/component",
            },
            { label: "Vite Plugin", slug: "docs/vite-plugin" },
            {
              label: "Loaders",
              items: [
                { label: "Overview", slug: "docs/image/loaders/overview" },
                { label: "Cloudflare", link: "docs/loaders/cloudflare" },
                { label: "Cloudinary", link: "docs/loaders/cloudinary" },
                { label: "Contentful", link: "docs/loaders/contentful" },
                { label: "Imgproxy", link: "docs/loaders/imgproxy" },
                { label: "Kontent", link: "docs/loaders/kontent" },
                { label: "Netlify", link: "docs/loaders/netlify" },
                { label: "Wordpress", link: "docs/loaders/wordpress" },

                {
                  label: "Custom Loader",
                  slug: "docs/image/loaders/custom-loader",
                },
              ],
            },
          ],
        },
      ],
    }) as any,

    tanstackStart(),
    viteReact(),
  ],
});

export default config;
