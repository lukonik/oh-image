import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import { ohImage } from "@lonik/oh-image/plugin";
import { prestige } from "@lonik/prestige/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const config = defineConfig({
  base: "/oh-image/",
  resolve: {
    dedupe: ["react", "react-dom"],
  },

  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    prestige({
      title: "Oh Image",
      license: {
        label: "MIT",
        url: "https://github.com/lonik/oh-image/blob/main/LICENSE",
      },
      github: "https://github.com/lukonik/oh-image",
      algolia: {
        appId: "IYIAYOLJHX",
        apiKey: "137a443b7b9b637b8b76b11a2c82c15e",
        indices: ["oh-imageoh-image"],
      },
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
                { label: "Cloudflare", link: "/docs/loaders/cloudflare" },
                { label: "Cloudinary", slug: "docs/loaders/cloudinary" },
                { label: "Contentful", link: "/docs/loaders/contentful" },
                { label: "Imgproxy", link: "/docs/loaders/imgproxy" },
                { label: "Kontent", link: "/docs/loaders/kontent" },
                { label: "Netlify", link: "/docs/loaders/netlify" },
                { label: "Supabase", link: "/docs/loaders/supabase" },
                { label: "Wordpress", link: "/docs/loaders/wordpress" },
                {
                  label: "Custom Loader",
                  slug: "docs/loaders/custom-loader",
                },
              ],
            },
          ],
        },
      ],
    }),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      baseURL: "/oh-image",
      renderer: false,
    }),

    tailwindcss(),
    devtools(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    ohImage({
      outDir: ".output/public",
    }),
    viteReact(),
  ],
});

export default config;
