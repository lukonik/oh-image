import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { createServer, ViteDevServer } from "vite";
import { ohImage } from "../../src/plugin/plugin"; // Import directly from plugin file
import request from "supertest";
import { DEV_DIR } from "../../src/plugin/plugin";
import * as fileUtils from "../../src/plugin/file-utils";
import * as imageProcess from "../../src/plugin/image-process";
import * as imageEntries from "../../src/plugin/image-entries";
import sharp from "sharp";
import { join } from "path";

// Mock dependencies
vi.mock("sharp");
vi.mock("../../src/plugin/file-utils");
vi.mock("../../src/plugin/image-process");
vi.mock("../../src/plugin/image-entries");

describe("ohImage plugin", () => {
  const mockSharpMetadata = { width: 1000, height: 800 };
  const mockHash = "mock-hash";
  const mockProcessedBuffer = Buffer.from("processed-image");

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Sharp mock
    (sharp as unknown as Mock).mockReturnValue({
      metadata: vi.fn().mockResolvedValue(mockSharpMetadata),
    });

    // Setup File Utils mock
    (fileUtils.getFileHash as Mock).mockResolvedValue(mockHash);
    (fileUtils.readFileSafe as Mock).mockResolvedValue(null);
    (fileUtils.saveFileSafe as Mock).mockResolvedValue(undefined);

    // Setup Image Process mock
    (imageProcess.processImage as Mock).mockResolvedValue(mockProcessedBuffer);

    // Setup Image Entries mock
    // We need a working mock implementation to store/retrieve entries for the integration between load/server/writeBundle
    const mockEntries = new Map();
    const mockImageEntriesInstance = {
        get: vi.fn((key) => mockEntries.get(key)),
        set: vi.fn((key, val) => mockEntries.set(key, val)),
        entries: vi.fn(() => mockEntries.entries()),
        createMainEntry: vi.fn((id, entry) => mockEntries.set(id, entry)),
        createPlaceholderEntry: vi.fn((id, entry) => mockEntries.set(id, entry)),
        createSrcSetEntry: vi.fn((id, entry) => mockEntries.set(id, entry)),
    };
    (imageEntries.createImageEntries as Mock).mockReturnValue(mockImageEntriesInstance);
  });

  describe("load hook", () => {
    it("should process valid image requests", async () => {
      const plugin = ohImage();
      const loadHandler = (plugin.load as any).handler;

      const result = await loadHandler("test-image.jpg?oh&width=500");
      
      expect(sharp).toHaveBeenCalledWith("test-image.jpg");
      expect(fileUtils.getFileHash).toHaveBeenCalledWith("test-image.jpg");
      
      // Verify the returned code
      expect(result).toContain("export default");
      expect(result).toContain("width");
      expect(result).toContain("height");
      expect(result).toContain("src");
      
      // Verify entry creation
      const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
      expect(mockEntriesInstance.createMainEntry).toHaveBeenCalled();
    });

    it("should handle placeholders", async () => {
      const plugin = ohImage();
      const loadHandler = (plugin.load as any).handler;

      const result = await loadHandler("test-image.jpg?oh&placeholder=true");
      
      const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
      expect(mockEntriesInstance.createPlaceholderEntry).toHaveBeenCalled();
      expect(result).toContain("placeholderUrl");
    });

    it("should handle breakpoints (srcSet)", async () => {
      const plugin = ohImage({ breakpoints: [300, 600] });
      const loadHandler = (plugin.load as any).handler;

      const result = await loadHandler("test-image.jpg?oh");
      
      const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
      expect(mockEntriesInstance.createSrcSetEntry).toHaveBeenCalledTimes(2); // 2 breakpoints
      expect(result).toContain("srcSets");
    });

    it("should ignore requests without 'oh' query", async () => {
      const plugin = ohImage();
      const loadHandler = (plugin.load as any).handler;

      const result = await loadHandler("test-image.jpg");
      expect(result).toBeNull();
    });
  });

  describe("writeBundle hook", () => {
    it("should process and save all image entries", async () => {
        const plugin = ohImage();
        const configResolved = (plugin.configResolved as any);
        const writeBundle = (plugin.writeBundle as any);

        // Simulate config resolved to set outDir
        configResolved({
            command: 'build',
            build: { assetsDir: 'assets', outDir: 'dist' },
            root: '/root',
            cacheDir: '/root/.vite'
        });

        // Pre-populate entries via mock
        const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
        const entry = { origin: 'test.jpg', width: 100 };
        mockEntriesInstance.entries.mockReturnValue([['image-id.webp', entry]].values());

        await writeBundle();

        expect(imageProcess.processImage).toHaveBeenCalledWith('test.jpg', entry);
        expect(fileUtils.saveFileSafe).toHaveBeenCalledWith(join('/root/dist', 'image-id.webp'), expect.any(Buffer));
    });
  });

  describe("configureServer middleware", () => {
    let server: ViteDevServer;

    beforeEach(async () => {
      server = await createServer({
        plugins: [ohImage()],
        configFile: false,
        server: { middlewareMode: true },
        root: '/root',
        cacheDir: '/root/.vite',
        optimizeDeps: { noDiscovery: true } 
      });
    });

    afterEach(async () => {
      await server.close();
    });

    function mRequest() {
      return request(server.middlewares);
    }

    it("should serve cached file if it exists", async () => {
      // Setup cached file existence
      (fileUtils.readFileSafe as Mock).mockResolvedValue(Buffer.from("cached-image"));
      
      // Setup entry existence (required even for cached files)
      const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
      mockEntriesInstance.get.mockReturnValue({ origin: 'origin.jpg', width: 100 });

      const response = await mRequest()
        .get(DEV_DIR + "test.webp")
        .set("Accept", "image/webp");
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(Buffer.from("cached-image"));
      expect(fileUtils.readFileSafe).toHaveBeenCalled();
      // Should NOT process if cached
      expect(imageProcess.processImage).not.toHaveBeenCalled();
    });

    it("should process and serve file if not in cache but entry exists", async () => {
       // Setup cache miss
       (fileUtils.readFileSafe as Mock).mockResolvedValue(null);
       
       // Setup entry existence
       const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
       mockEntriesInstance.get.mockReturnValue({ origin: 'origin.jpg', width: 100 });

       const response = await mRequest()
         .get(DEV_DIR + "test.webp")
         .set("Accept", "image/webp");

       expect(response.status).toBe(200);
       expect(imageProcess.processImage).toHaveBeenCalled();
       expect(fileUtils.saveFileSafe).toHaveBeenCalled();
    });

    it("should 404/next if entry not found", async () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        (fileUtils.readFileSafe as Mock).mockResolvedValue(null);
        
        const mockEntriesInstance = (imageEntries.createImageEntries as Mock).mock.results[0].value;
        mockEntriesInstance.get.mockReturnValue(undefined);
 
        const response = await mRequest()
          .get(DEV_DIR + "unknown.webp");
        
        expect(response.status).toBe(404);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Image entry not found"));
        consoleSpy.mockRestore();
    });

    it("should ignore non-plugin requests", async () => {
        const response = await mRequest().get("/other.js");
        expect(response.status).toBe(404);
    });
  });
});