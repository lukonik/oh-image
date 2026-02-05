export interface RegisteredImage {
  width?: number;
  height?: number;
  blur?: boolean | number;
  origin: string;
  format: string;
}

const _store = new Map<string, RegisteredImage>();

const add = (id: string, image: RegisteredImage) => _store.set(id, image);

const get = (id: string) => _store.get(id);

const all = () => _store.entries();

const size = () => _store.size;

export default { add, get, all, size };
