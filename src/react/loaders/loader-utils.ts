export function resolveOption(key: string, value: unknown, separator: string) {
  return `${key}${separator}${value}`;
}

export function resolveDeprecatedParams(source: any, separator: string) {
  const params: string[] = [];
  for (const key of Object.keys(params)) {
    const value = source[key];
    if (value !== undefined) {
      params.push(resolveOption(key, value, separator));
    }
  }
  return params;
}
