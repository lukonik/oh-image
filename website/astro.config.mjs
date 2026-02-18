// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://lukonik.github.io",
  base: "/oh-image",
  integrations: [
    starlight({
      title: "Oh Image",
      plugins: [],
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://lukonik.github.io/oh-image/oh-image-hero.svg",
          },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:type", content: "image/svg+xml" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:width", content: "512" },
        },
        {
          tag: "meta",
          attrs: { property: "og:image:height", content: "512" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary" },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: "https://lukonik.github.io/oh-image/oh-image-hero.svg",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/lukonik/oh-image",
        },
      ],
      sidebar: [
        { label: "Introduction", slug: "docs/introduction" },
        { label: "Installation", slug: "docs/installation" },
        { label: "Typescript", slug: "docs/typescript" },
        {
          label: "Image",
          slug: "docs/image/component",
        },
        {
          label: "Loaders",
          items: [
            { label: "Overview", slug: "docs/image/loaders/overview" },
            { label: "Imgproxy", link: "docs/image/loaders/imgproxy" },
            { label: "Cloudflare", link: "docs/image/loaders/cloudflare" },
            { label: "Cloudinary", link: "docs/image/loaders/cloudinary" },
            {
              label: "Custom Loader",
              slug: "docs/image/loaders/custom-loader",
            },
          ],
        },
        { label: "Vite Plugin", slug: "docs/vite-plugin" },
      ],
      customCss: ["./src/styles/global.css"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
