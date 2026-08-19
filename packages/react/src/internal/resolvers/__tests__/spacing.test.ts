import { describe, it, expect } from "vitest";
import {
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from "../spacing";

const validSpacingValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15"] as const;

describe("paddingAllClass", () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-padding-${v}" for "${v}"`, () => {
      expect(paddingAllClass(v)).toBe(`pathable-padding-${v}`);
    });
  });

  it("returns undefined for undefined", () => {
    expect(paddingAllClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(paddingAllClass(null)).toBeUndefined();
  });

  it("returns undefined for invalid value", () => {
    expect(paddingAllClass("bad" as any)).toBeUndefined();
  });
});

describe("paddingXClass", () => {
  it('returns "pathable-padding-x-4" for "4"', () => {
    expect(paddingXClass("4")).toBe("pathable-padding-x-4");
  });

  it("returns undefined for undefined", () => {
    expect(paddingXClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(paddingXClass(null)).toBeUndefined();
  });
});

describe("paddingYClass", () => {
  it('returns "pathable-padding-y-2" for "2"', () => {
    expect(paddingYClass("2")).toBe("pathable-padding-y-2");
  });

  it("returns undefined for undefined", () => {
    expect(paddingYClass(undefined)).toBeUndefined();
  });
});

describe("marginAllClass", () => {
  validSpacingValues.forEach((v) => {
    it(`returns "pathable-margin-${v}" for "${v}"`, () => {
      expect(marginAllClass(v)).toBe(`pathable-margin-${v}`);
    });
  });

  it("returns undefined for undefined", () => {
    expect(marginAllClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(marginAllClass(null)).toBeUndefined();
  });
});

describe("marginXClass", () => {
  it('returns "pathable-margin-x-1" for "1"', () => {
    expect(marginXClass("1")).toBe("pathable-margin-x-1");
  });

  it("returns undefined for undefined", () => {
    expect(marginXClass(undefined)).toBeUndefined();
  });
});

describe("marginYClass", () => {
  it('returns "pathable-margin-y-3" for "3"', () => {
    expect(marginYClass("3")).toBe("pathable-margin-y-3");
  });

  it("returns undefined for undefined", () => {
    expect(marginYClass(undefined)).toBeUndefined();
  });
});

describe("marginTopClass", () => {
  it('returns "pathable-margin-top-4" for "4"', () => {
    expect(marginTopClass("4")).toBe("pathable-margin-top-4");
  });

  it("returns undefined for undefined", () => {
    expect(marginTopClass(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(marginTopClass(null)).toBeUndefined();
  });
});

describe("marginBottomClass", () => {
  it('returns "pathable-margin-bottom-2" for "2"', () => {
    expect(marginBottomClass("2")).toBe("pathable-margin-bottom-2");
  });

  it("returns undefined for undefined", () => {
    expect(marginBottomClass(undefined)).toBeUndefined();
  });
});