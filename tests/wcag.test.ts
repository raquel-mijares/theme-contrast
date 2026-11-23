import { describe, expect, it } from "vitest";
import { contrastRatio, meetsWcag } from "../src/contrast.js";

describe("meetsWcag", () => {
  it("uses 4.5:1 for normal text and 3:1 for large text at AA", () => {
    expect(meetsWcag(4.5, "AA")).toBe(true);
    expect(meetsWcag(3, "AA", "large")).toBe(true);
    expect(meetsWcag(2.99, "AA", "large")).toBe(false);
  });

  it("uses 7:1 for normal text and 4.5:1 for large text at AAA", () => {
    expect(meetsWcag(6.99, "AAA")).toBe(false);
    expect(meetsWcag(7, "AAA")).toBe(true);
    expect(meetsWcag(4.5, "AAA", "large")).toBe(true);
  });

  it("does not round up a ratio that is just under the threshold", () => {
    const gray = 0x77 / 255;
    const ratio = contrastRatio([gray, gray, gray], [1, 1, 1]);
    expect(ratio.toFixed(1)).toBe("4.5");
    expect(meetsWcag(ratio, "AA")).toBe(false);
  });
});
