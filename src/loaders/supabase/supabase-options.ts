import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type SupabaseTransforms = Partial<{
  /** Resize width in pixels. */
  width: number;

  /** Resize height in pixels. */
  height: number;

  /** Output quality from 20 to 100. */
  quality: number;

  /** Resize mode used by Supabase Storage. */
  resize: "cover" | "contain" | "fill";

  /**
   * Supabase documents `origin` to opt out of automatic format optimization.
   */
  format: "origin";
}>;

export type SupabaseOptions = BaseLoaderOptions<SupabaseTransforms>;
export type SupabaseGlobalOptions =
  BaseGlobalLoaderOptions<SupabaseTransforms>;
