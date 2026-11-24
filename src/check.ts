import { contrastRatio, meetsWcag, type TextSize } from "./contrast.js";
import { resolveColor, type TokenTree } from "./tokens.js";

export type PairResult = {
  foreground: string;
  background: string;
  ratio: number;
  aa: boolean;
  aaa: boolean;
};

export function checkPair(tree: TokenTree, foreground: string, background: string, size: TextSize = "normal"): PairResult {
  const ratio = contrastRatio(resolveColor(tree, foreground), resolveColor(tree, background));
  return {
    foreground,
    background,
    ratio,
    aa: meetsWcag(ratio, "AA", size),
    aaa: meetsWcag(ratio, "AAA", size),
  };
}
