import { createFileRoute } from "@tanstack/react-router";
import { loaders } from "../loaders/loaders";

// 1. Define the Route and Data Loader (Replaces getStaticPaths)
export const Route = createFileRoute("/(prestige)/docs/loaders/$loader")({
  loader: ({ params }) => {
    console.log("CAAAME HEREE ",params)
    const loaderData = loaders.find((l) => l.slug === params.loader);

    if (!loaderData) {
      throw new Error(`Loader with slug "${params.loader}" not found`);
    }

    return loaderData;
  },
  component: LoaderDocumentationPage,
});

// --- Mock UI Components (Replace with your actual UI/Design System) ---
const Code = ({
  code,
  lang,
  title,
}: {
  code: string;
  lang?: string;
  title?: string;
}) => (
  <div className="code-block my-4 rounded border bg-gray-900 p-4 text-white">
    {title && (
      <div className="mb-2 text-sm font-bold text-gray-400">{title}</div>
    )}
    <pre>
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  </div>
);

const Aside = ({ children }: { children: React.ReactNode }) => (
  <aside className="my-4 border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-900">
    {children}
  </aside>
);
// ---------------------------------------------------------------------

// 2. The Page Component
function LoaderDocumentationPage() {
  // Access the data fetched by the route's loader (Replaces Astro.props)
  const loaderItem = Route.useLoaderData();

  const loaderName = loaderItem.name;
  const providerName = `${loaderName}LoaderProvider`;
  const useLoaderName = `use${loaderName}Loader`;
  const useContextName = `use${loaderName}Context`;

  return (
    <div className="starlight-page-equivalent mx-auto max-w-4xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{loaderItem.title}</h1>
      </header>

      <p className="mb-4">
        This integration allows you to use <strong>{loaderItem.name}</strong>{" "}
        for image optimization. For more details, refer to the{" "}
        <a
          href={loaderItem.link}
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          official documentation
        </a>
        .
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Module import</h2>
      <Code
        lang="ts"
        code={`import * as ${loaderItem.name} from '@lonik/oh-image/${loaderItem.name.toLowerCase()}'`}
      />

      <h2 className="mt-8 text-2xl font-semibold">URL Schema</h2>
      <p className="mb-4">The loader generates URLs following this pattern:</p>
      <Code code={loaderItem.urlSchema} lang="bash" title="URL Schema" />

      <h2 className="mt-8 text-2xl font-semibold">{useLoaderName}</h2>
      <p className="mb-4">
        The primary hook for generating the loader function. It accepts
        configuration options (including transforms and placeholder settings)
        and returns a function that generates the final image URL. Pass this
        result to the <code>loader</code> prop of the <code>Image</code>{" "}
        component.
      </p>
      <Code
        code={`import { ${useLoaderName} } from '@lonik/oh-image/${loaderItem.name.toLowerCase()}';
import { Image } from '@lonik/oh-image/react'

function MyComponent() {
  const loader = ${useLoaderName}(${loaderItem.defaults});

  return (
    <Image
      src="image.jpg"
      width={500}
      loader={loader}
      placeholder={true}
    />
  );
}`}
        lang="tsx"
        title={`Using ${useLoaderName}`}
      />

      <h2 className="mt-8 text-2xl font-semibold">{providerName}</h2>
      <p className="mb-4">
        A Context Provider that configures global options for all child
        components using this loader. This is the recommended way to set the
        base path/URL and default transforms.
      </p>
      <Code
        code={`import { ${providerName} } from '@lonik/oh-image/${loaderItem.name.toLowerCase()}';

function App() {
  return (
    <${providerName}
      path="https://example.com/images"
      transforms={OPTIONS}
      placeholder={PLACEHOLDER_OPTIONS}
    >
      <MyApp />
    </${providerName}>
  );
}`}
        lang="tsx"
        title={`Configuring ${providerName}`}
      />

      <h2 className="mt-8 text-2xl font-semibold">{useContextName}</h2>
      <p className="mb-4">Returns the global configuration of the loader.</p>

      <h2 className="mt-8 text-2xl font-semibold">Global Defaults</h2>
      <p className="mb-4">
        By default the loader is configured with the following properties:
      </p>
      <Code
        code={loaderItem.defaults}
        lang="ts"
        title={`${loaderItem.title} Default Config`}
      />

      {loaderItem.globalOptions && (
        <>
          <h2 className="mt-8 text-2xl font-semibold">Global Options</h2>
          <p className="mb-4">
            Everything in transformation options in addition to:
          </p>
          <Code
            code={loaderItem.globalOptions}
            lang="ts"
            title={`${loaderItem.title} Global Options`}
          />
        </>
      )}

      <h2 className="mt-8 text-2xl font-semibold">Transforms Option</h2>
      <p className="mb-4">
        Below is the transformation options for this loader.
      </p>
      <Aside>
        <p>
          We try to keep parameters updated, but if you notice any missing, you
          can still pass them; the URL will generate correctly despite the lack
          of TypeScript IntelliSense. If you find a missing parameter, please
          open a GitHub issue so we can add official support.
        </p>
      </Aside>
      <Code
        code={loaderItem.interface}
        lang="ts"
        title={`${loaderItem.title} Interface`}
      />
    </div>
  );
}
