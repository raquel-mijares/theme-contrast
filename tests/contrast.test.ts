import { describe, expect, it } from "vitest";
import { contrastRatio } from "../src/contrast.js";

describe("contrastRatio", () => {
  it("is 21:1 for black on white", () => {
    expect(contrastRatio([0, 0, 0], [1, 1, 1])).toBeCloseTo(21, 5);
  });

  it("is 1:1 for the same color", () => {
    expect(contrastRatio([0.2, 0.4, 0.6], [0.2, 0.4, 0.6])).toBe(1);
  });

  it("does not depend on the order of the pair", () => {
    const a = [0.1, 0.5, 0.9] as const;
    const b = [0.9, 0.9, 0.2] as const;
    expect(contrastRatio(a, b)).toBe(contrastRatio(b, a));
  });

  it("puts #777777 on white just under the 4.5:1 AA threshold", () => {
    const gray = 0x77 / 255;
    expect(contrastRatio([gray, gray, gray], [1, 1, 1])).toBeCloseTo(4.48, 2);
  });
});
