import { describe, it, expect } from "vitest";
import { flexClass } from "../flexGrid";

describe("flexClass", () => {
  it('returns "pathable-flex-1" for "1"', () => {
    expect(flexClass("1")).toBe("pathable-flex-1");
  });

  it('returns "pathable-flex-fill" for "fill"', () => {
    expect(flexClass("fill")).toBe("pathable-flex-fill");
  });

  it("returns undefined for undefined", () => {
    expect(flexClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(flexClass(null)).toBeUndefined();
  });

  it("returns undefined for invalid value", () => {
    expect(flexClass("auto" as any)).toBeUndefined();
  });
});