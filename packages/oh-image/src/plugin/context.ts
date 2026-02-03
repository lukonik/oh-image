export interface ContextConfig {
  isDev: boolean;
  root: string;
}

const context: ContextConfig = {
  isDev: true,
  root: "",
};

export function initContext(config: ContextConfig) {
  context.isDev = config.isDev;
  context.root = config.root;
}

export function getRoot() {
  return context.root;
}

export function isDev() {
  return context.isDev;
}
