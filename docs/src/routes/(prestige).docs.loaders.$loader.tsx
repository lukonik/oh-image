import { Aside, Code, PrestigePage } from "@lonik/prestige/ui";
import { createFileRoute } from "@tanstack/react-router";
import { loaders } from "../loaders/loaders";

// 1. Define the Route and Data Loader (Replaces getStaticPaths)
export const Route = createFileRoute("/(prestige)/docs/loaders/$loader")({
  loader: ({ params }) => {
    const loaderData = loaders.find((l) => l.slug === params.loader);

    if (!loaderData) {
      throw new Error(`Loader with slug "${params.loader}" not found`);
    }

    return loaderData;
  },
  component: LoaderDocumentationPage,
});

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
    <PrestigePage>
      <h1 className="text-3xl font-bold">{loaderItem.title}</h1>
      <p className="mb-4">
        This integration allows you to use <strong>{loaderItem.name}</strong>
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
        language="ts"
        code={`import * as ${loaderItem.name} from '@lonik/oh-image/${loaderItem.name.toLowerCase()}'`}
      />

      <h2 className="mt-8 text-2xl font-semibold">URL Schema</h2>
      <p className="mb-4">The loader generates URLs following this pattern:</p>
      <h2>URL Schema</h2>
      <Code code={loaderItem.urlSchema} language="bash" />

      <h2 className="mt-8 text-2xl font-semibold">{useLoaderName}</h2>
      <p className="mb-4">
        The primary hook for generating the loader function. It accepts
        configuration options (including transforms and placeholder settings)
        and returns a function that generates the final image URL. Pass this
        result to the <code>loader</code> prop of the <code>Image</code>{" "}
        component.
      </p>
      <h2>{`Using ${useLoaderName}`}</h2>
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
        language="tsx"
      />

      <h2 className="mt-8 text-2xl font-semibold">{providerName}</h2>
      <p className="mb-4">
        A Context Provider that configures global options for all child
        components using this loader. This is the recommended way to set the
        base path/URL and default transforms.
      </p>
      <h2>{`Configuring ${providerName}`}</h2>

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
        language="tsx"
      />

      <h2 className="mt-8 text-2xl font-semibold">{useContextName}</h2>
      <p className="mb-4">Returns the global configuration of the loader.</p>

      <h2 className="mt-8 text-2xl font-semibold">Global Defaults</h2>
      <p className="mb-4">
        By default the loader is configured with the following properties:
      </p>
      <h2>{`${loaderItem.title} Default Config`}</h2>

      <Code code={loaderItem.defaults} language="ts" />

      {loaderItem.globalOptions && (
        <>
          <h2 className="mt-8 text-2xl font-semibold">Global Options</h2>
          <p className="mb-4">
            Everything in transformation options in addition to:
          </p>
          <h2>{`${loaderItem.title} Global Options`}</h2>

          <Code language="ts">{loaderItem.globalOptions}</Code>
        </>
      )}

      <h2 className="mt-8 text-2xl font-semibold">Transforms Option</h2>
      <p className="mb-4">
        Below is the transformation options for this loader.
      </p>
      <Aside>
        We try to keep parameters updated, but if you notice any missing, you
        can still pass them; the URL will generate correctly despite the lack of
        TypeScript IntelliSense. If you find a missing parameter, please open a
        GitHub issue so we can add official support.
      </Aside>
      <h2>{`${loaderItem.title} Interface`}</h2>
      <Code code={loaderItem.interface} language="ts" />
    </PrestigePage>
  );
}
