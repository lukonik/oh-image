import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import Heroimage from "../assets/oh-image-hero.svg?$oh";
import config from "virtual:prestige/config";

const siteUrl = "https://lukonik.github.io/oh-image";
const homeTitle = "React Image Component and Vite Image Plugin | Oh Image";
const homeDescription =
  "Oh Image is a React image component and Vite image plugin for responsive images, placeholders, static optimization, and CDN loaders.";
const homeKeywords =
  "react image component, vite image component, vite image plugin, responsive react images, image optimization vite, react image placeholder";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: homeTitle },
      { name: "description", content: homeDescription },
      { name: "keywords", content: homeKeywords },
      { property: "og:title", content: homeTitle },
      { property: "og:description", content: homeDescription },
      { property: "og:url", content: `${siteUrl}/` },
      { name: "twitter:title", content: homeTitle },
      { name: "twitter:description", content: homeDescription },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/` }],
  }),
});

export function App() {
  return (
    <div className="flex flex-col-reverse lg:flex-row mx-auto lg:w-6xl items-start lg:pt-20">
      <div>
        <h1 className="text-3xl lg:text-6xl font-medium leading-snug mt-2 lg:mt-10 text-center lg:text-start">
          The Missing &lt;Image /&gt; Component for
          <span className="font-black ml-2 text-primary-600">React</span>
        </h1>
        <div className="mt-10 flex lg:justify-start items-center justify-center gap-4">
          <Link to="/docs/introduction">
            <button className="rounded-full px-4 lg:px-8 bg-primary-600 text-white lg:h-14 h-12 flex items-center justify-center gap-4 cursor-pointer">
              Introduction <ArrowRight size={20} />
            </button>
          </Link>
          <a rel="noreferrer" href={config.github} target="_blank">
            <button className="rounded-full px-4 lg:px-8  h-14 flex items-center justify-center gap-4 cursor-pointer">
              Star on Github <Github />
            </button>
          </a>
        </div>
      </div>

      <div className="shrink-0">
        <Heroimage alt="Oh Image hero illustration" className="w-100 h-100" />
      </div>
    </div>
  );
}
