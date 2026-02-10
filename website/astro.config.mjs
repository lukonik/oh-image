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
        {
          label: "Docs",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Introduction", slug: "docs/introduction" },
            { label: "Installation", slug: "docs/installation" },
            { label: "Usage", slug: "docs/usage" },
            { label: "Image component", slug: "docs/image-component" },
            { label: "Plugin", slug: "docs/plugin" },
            { label: "Typescript", slug: "docs/typescript" },
          ],
        },
        {
          label: "img theory",
          badge: { text: "Coming Soon", variant: "tip" },
          items: [
            { label: "Introduction", slug: "img-theory/introduction" },
          ],
        },
      ],
      customCss: ["./src/styles/global.css"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
