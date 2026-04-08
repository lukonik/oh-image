import { renderHook } from "vitest-browser-react";
import { describeImageOptions, describeOptionFactory } from "./loaders-utils";
import type { SupabaseTransforms } from "../../../src/loaders/supabase/supabase-options";
import { useSupabaseLoader } from "../../../src/loaders/supabase/supabase-loader";
import { chai, describe, expect, it } from "vitest";

chai.config.truncateThreshold = 100000;

describe("supabase", () => {
  const optionSeparator = "=";

  const describeOption = describeOptionFactory<SupabaseTransforms>(
    (options) => useSupabaseLoader(options),
    optionSeparator,
  );

  describeImageOptions(
    () =>
      useSupabaseLoader({
        path: "project",
      }),
    "width",
    "height",
    optionSeparator,
  );

  it("builds the URL from the Supabase project id", async () => {
    const { result } = await renderHook(() =>
      useSupabaseLoader({
        path: "project-ref",
      }),
    );

    const url = result.current({
      src: "bucket/test.png",
    });

    expect(url).toContain(
      "https://project-ref.supabase.co/storage/v1/render/image/public/bucket/test.png",
    );
  });

  describeOption("width", 200);
  describeOption("height", 400);
  describeOption("quality", 80);
  describeOption("resize", "contain");
  describeOption("format", "origin");
});
