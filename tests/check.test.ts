import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkPair } from "../src/check.js";

const tokens = JSON.parse(readFileSync(new URL("./fixtures/basic.tokens.json", import.meta.url), "utf8"));

describe("checkPair", () => {
  it("reports the ratio and AA/AAA results for two token paths", () => {
    const result = checkPair(tokens, "color.text", "color.background");
    expect(result).toMatchObject({ foreground: "color.text", background: "color.background", aa: false, aaa: false });
    expect(result.ratio).toBeCloseTo(4.48, 2);
  });

  it("passes the same pair as large text at AA", () => {
    expect(checkPair(tokens, "color.text", "color.background", "large")).toMatchObject({ aa: true, aaa: false });
  });

  it("gives the same ratio when foreground and background are swapped", () => {
    const forward = checkPair(tokens, "color.text", "color.background");
    const swapped = checkPair(tokens, "color.background", "color.text");
    expect(swapped.ratio).toBe(forward.ratio);
  });

  it("names the missing token when a path is wrong", () => {
    expect(() => checkPair(tokens, "color.text", "color.surface")).toThrow("Token not found: color.surface");
  });
});
