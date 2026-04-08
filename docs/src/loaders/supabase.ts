export const supabase = {
  slug: "supabase",
  name: "Supabase",
  title: "Supabase Loader",
  urlSchema: "https://<project_id>.supabase.co/storage/v1/render/image/public/<src>?<params>",
  defaults: `
  {
    placeholder: {
      quality: 20,
    },
  }
  `,
  link: "https://supabase.com/docs/guides/storage/serving/image-transformations",
  globalOptions: `{
  /**
   * Supabase project id.
   * Example: "project-ref"
   */
  path: string;
}`,
  interface: `{
  /** Resize width in pixels. */
  width: number;

  /** Resize height in pixels. */
  height: number;

  /** Output quality from 20 to 100. */
  quality: number;

  /** Resize mode used by Supabase Storage. */
  resize: "cover" | "contain" | "fill";

  /**
   * Use "origin" to disable Supabase's automatic format optimization.
   */
  format: "origin";
}`,
};
