import { describe, it, expect } from "vitest";
import { queryToOptions } from "../../src/plugin/utils";
const PROCESS_KEY = "oh";
describe("queryToOptions", () => {
  it("should return shouldProcess false when oh is not provided", () => {
    const result = queryToOptions(PROCESS_KEY, "/test/image.png");
    expect(result).toMatchObject({
      shouldProcess: false,
    });
  });
  it("should return shouldProcess true when oh is provided", () => {
    const result = queryToOptions(PROCESS_KEY, "/test/image.png?oh");
    expect(result).toMatchObject({
      shouldProcess: true,
    });
  });

  it("should return path when uri is provided", () => {
    const result = queryToOptions(PROCESS_KEY, "/test/image.png?oh");
    expect(result).toMatchObject({
      path: "/test/image.png",
    });
  });

  it("should return empty options when nothing is provided", () => {
    const { options } = queryToOptions(PROCESS_KEY, "/test/image.png?oh");
    expect(options).toEqual({
      [PROCESS_KEY]: null,
    });
  });

  it("should return number when stringified number is provided", () => {
    const { options } = queryToOptions(
      PROCESS_KEY,
      "/test/image.png?oh&blur=30",
    );
    expect(options).toMatchObject({
      blur: 30,
    });
  });

  it("should return boolean when stringified boolean is provided", () => {
    const { options } = queryToOptions(
      PROCESS_KEY,
      "/test/image.png?oh&blur=true",
    );
    expect(options).toMatchObject({
      blur: true,
    });
  });

  it("should return array when comma separated values are provided", () => {
    const { options } = queryToOptions(
      PROCESS_KEY,
      "/test/image.png?oh&bps=16,48,96",
    );
    expect(options).toMatchObject({
      bps: [16, 48, 96],
    });
  });
});
