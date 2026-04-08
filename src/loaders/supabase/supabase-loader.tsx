import {
  type SupabaseTransforms,
  type SupabaseGlobalOptions,
} from "./supabase-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useSupabaseContext,
  LoaderProvider: SupabaseLoaderProvider,
  useLoader: useSupabaseLoader,
} = loaderFactory<SupabaseTransforms, SupabaseGlobalOptions>(
  {
    placeholder: {
      quality: 20,
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: "&",
    widthKey: "width",
    heightKey: "height",
  },
  ({ path, params, imageOptions }) => {
    const projectId = path.trim();
    const baseUrl = `https://${projectId}.supabase.co/storage/v1/render/image/public/${imageOptions.src}`;
    return params ? `${baseUrl}?${params}` : baseUrl;
  },
);
