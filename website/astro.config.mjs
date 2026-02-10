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
