import sharp from "sharp";

export abstract class BaseOptimizer {
  constructor(private path: string) {}

  private get instance() {
    return sharp(this.path);
  }

  async metadata() {
    return await this.instance.metadata();
  }

  async blur() {
    const buffer = await this.instance
      .resize(20) // Resize to a tiny width
      .blur(1) // Light blur to smooth out pixels
      .toFormat("webp", { quality: 20 }) // Smallest possible size
      .toBuffer();
    return buffer;
  }
}
