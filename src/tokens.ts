import type { Rgb } from "./contrast.js";

export type TokenTree = { [key: string]: unknown };

const ALIAS = /^\{([^{}]+)\}$/;

function isRecord(value: unknown): value is TokenTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findToken(tree: TokenTree, path: string, via: string[]): { token: TokenTree; type: unknown } {
  let node: unknown = tree;
  let type: unknown;
  for (const key of path.split(".")) {
    if (isRecord(node) && "$type" in node) {
      type = node.$type;
    }
    node = isRecord(node) ? node[key] : undefined;
  }
  if (!isRecord(node) || !("$value" in node)) {
    const from = via.length > 0 ? ` (via ${via.join(" -> ")})` : "";
    throw new Error(`Token not found: ${path}${from}`);
  }
  return { token: node, type: node.$type ?? type };
}

function toRgb(value: unknown, path: string): Rgb {
  if (typeof value === "string") {
    throw new Error(`${path}: "${value}" is a string, but DTCG 2025.10 colors are objects with colorSpace and components`);
  }
  if (!isRecord(value) || value.colorSpace !== "srgb") {
    throw new Error(`${path}: only srgb colors are supported`);
  }
  const { components, alpha = 1 } = value;
  if (
    !Array.isArray(components) ||
    components.length !== 3 ||
    !components.every((c) => typeof c === "number" && c >= 0 && c <= 1)
  ) {
    throw new Error(`${path}: components must be three numbers between 0 and 1`);
  }
  if (alpha !== 1) {
    throw new Error(`${path}: translucent colors need a backdrop and are not supported yet`);
  }
  return components as unknown as Rgb;
}

export function resolveColor(tree: TokenTree, path: string, seen: string[] = []): Rgb {
  if (seen.includes(path)) {
    throw new Error(`Circular alias: ${[...seen, path].join(" -> ")}`);
  }
  const { token, type } = findToken(tree, path, seen);
  if (type !== undefined && type !== "color") {
    throw new Error(`${path} is a ${String(type)} token, not a color`);
  }
  const { $value } = token;
  const alias = typeof $value === "string" ? ALIAS.exec($value) : null;
  if (alias?.[1]) {
    return resolveColor(tree, alias[1], [...seen, path]);
  }
  return toRgb($value, path);
}
