import { basename, join } from "node:path";
import type { FormatEnum } from "sharp";

export interface IdentifierDirs {
  isBuild: boolean;
  devDir: string;
  assetsDir: string;
  distDir: string;
}

function createId(
  name: string,
  format: keyof FormatEnum,
  prefix: string,
  hash: string,
  dirs: IdentifierDirs,
) {
  const fileId = basename(name);
  const uniqueFileId = `${prefix}-${hash}-${fileId}.${format}`;
  if (!dirs.isBuild) {
    return join(dirs.devDir, uniqueFileId);
  }
  return join(dirs.assetsDir, dirs.distDir, uniqueFileId);
}

export function createImageIdentifier(
  name: string,
  hash: string,
  dirs: IdentifierDirs,
) {
  return {
    main(format: keyof FormatEnum): string {
      return createId(name, format, "main", hash, dirs);
    },
    placeholder(format: keyof FormatEnum): string {
      return createId(name, format, "placeholder", hash, dirs);
    },
    srcSet(format: keyof FormatEnum, breakpoint: number): string {
      return createId(name, format, `breakpoint-${breakpoint}`, hash, dirs);
    },
  };
}
