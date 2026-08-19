import { describe, it, expect } from "vitest";
import { displayClass } from "../display";

describe("displayClass", () => {
  it('returns "pathable-display-flex" for "flex"', () => {
    expect(displayClass("flex")).toBe("pathable-display-flex");
  });

  it('returns "pathable-display-block" for "block"', () => {
    expect(displayClass("block")).toBe("pathable-display-block");
  });

  it('returns "pathable-display-inline" for "inline"', () => {
    expect(displayClass("inline")).toBe("pathable-display-inline");
  });

  it('returns "pathable-display-inline-block" for "inline-block"', () => {
    expect(displayClass("inline-block")).toBe("pathable-display-inline-block");
  });

  it('returns "pathable-display-none" for "none"', () => {
    expect(displayClass("none")).toBe("pathable-display-none");
  });

  it("returns undefined for undefined", () => {
    expect(displayClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(displayClass(null)).toBeUndefined();
  });

  it("returns undefined for invalid value", () => {
    expect(displayClass("grid" as any)).toBeUndefined();
  });
});