import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../src/contrast.js";
import { resolveColor } from "../src/tokens.js";

const tokens = JSON.parse(readFileSync(new URL("./fixtures/basic.tokens.json", import.meta.url), "utf8"));

describe("resolveColor", () => {
  it("reads a DTCG 2025.10 srgb color", () => {
    expect(resolveColor(tokens, "color.white")).toEqual([1, 1, 1]);
  });

  it("follows aliases to the final color", () => {
    expect(resolveColor(tokens, "color.text")).toEqual([0.4667, 0.4667, 0.4667]);
  });

  it("checks one text/background pair from the file", () => {
    const ratio = contrastRatio(resolveColor(tokens, "color.text"), resolveColor(tokens, "color.background"));
    expect(ratio).toBeLessThan(4.5);
  });

  it("fails on a missing token", () => {
    expect(() => resolveColor(tokens, "color.nope")).toThrow("Token not found: color.nope");
  });

  it("names the alias chain when an alias points to a missing token", () => {
    expect(() => resolveColor(tokens, "color.muted")).toThrow(
      "Token not found: color.gone (via color.muted -> color.subtle)",
    );
  });

  it("fails on a circular alias instead of looping forever", () => {
    expect(() => resolveColor(tokens, "color.loop-a")).toThrow("Circular alias");
  });

  it("explains that a hex string is not a DTCG 2025.10 color", () => {
    expect(() => resolveColor(tokens, "color.legacy")).toThrow(
      'color.legacy: "#777777" is a string, but DTCG 2025.10 colors are objects with colorSpace and components',
    );
  });

  it("refuses translucent colors instead of guessing the backdrop", () => {
    expect(() => resolveColor(tokens, "color.overlay")).toThrow("not supported yet");
  });
});
