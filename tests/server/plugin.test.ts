import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServer, ViteDevServer } from "vite";
import { ohImage } from "../../src/plugin";
import request from "supertest";
import { DEV_DIR } from "../../src/plugin/plugin";

describe("plugin", () => {
  describe("server", () => {
    let server: ViteDevServer;

    beforeEach(async () => {
      server = await createServer({
        plugins: [ohImage()],
        configFile: false,
        server: { middlewareMode: true },
      });
    });

    function mRequest() {
      return request(server.middlewares);
    }
    afterEach(async () => {
      await server.close();
    });
    it("should ignore non-image requests", async () => {
      const response = await mRequest()
        .get("/test-file.js")
        .set("Accept", "application/javascript");
      expect(response.statusCode).toBe(404);
    });
    it("should ignore requests that doesn't have DEV_DIR prefix with it", async () => {
      const response = await mRequest()
        .get("/test-file.js")
        .set("Accept", "application/javascript");
      expect(response.statusCode).toBe(404);
    });
    it("shoud log warning when image entry is not found", async () => {
      const spy = vi.spyOn(console, "warn");
      await mRequest()
        .get(DEV_DIR + "test-file.png")
        .set("Accept", "application/javascript");
      expect(spy).toBeCalled();
    });
  });
});
