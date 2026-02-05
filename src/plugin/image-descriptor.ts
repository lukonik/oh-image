import { parse } from "node:path";

export class ImageDescriptor {
  get name() {
    return this._name;
  }

  get ext() {
    return this._ext;
  }

  get fullName() {
    return `${this._name}.${this._ext}`;
  }

  get path(): string | null {
    return null;
  }

  protected constructor(
    private _name: string,
    private _ext: string,
  ) {}

  static fromId(id: string): StoredImageDescriptor {
    const { name, ext } = parse(id);
    return new StoredImageDescriptor(name, ext.slice(1), id);
  }

  static fromUrl(id: string) {
    const { name, ext } = parse(id);
    return new ImageDescriptor(name, ext.slice(1));
  }
}

export class StoredImageDescriptor extends ImageDescriptor {
  constructor(
    name: string,
    ext: string,
    private _path: string,
  ) {
    super(name, ext);
  }

  override get path(): string {
    return this._path;
  }
}
