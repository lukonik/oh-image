export function mergeConfig<T>(base: T, ovverides: T) {
  return { ...base, ...ovverides };
}
