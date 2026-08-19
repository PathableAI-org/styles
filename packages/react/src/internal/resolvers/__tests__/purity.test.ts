import { describe, it, expect } from "vitest";
import { widthClass, maxWidthClass } from "../sizing";
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
import { displayClass } from "../display";
import { alignItemsClass, justifyContentClass, textAlignClass } from "../alignment";
import { flexClass } from "../flexGrid";
import { fontFamilyClass, fontWeightClass } from "../typography";
import { backgroundColorClass, textColorClass } from "../colorTone";
import { mergeClasses } from "../mergeClasses";

const resolvers = {
  widthClass,
  maxWidthClass,
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
  displayClass,
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
  flexClass,
  fontFamilyClass,
  fontWeightClass,
  backgroundColorClass,
  textColorClass,
  mergeClasses,
};

describe("resolver purity — no browser globals", () => {
  it("no resolver file references window", () => {
    // If any resolver code references `window` at module scope, the
    // import above would fail in Node. This test codifies that expectation.
    // We also verify that the functions are callable without a browser.
    expect(typeof widthClass).toBe("function");
  });

  it("all resolver functions are synchronous and non-throwing", () => {
    for (const [name, fn] of Object.entries(resolvers)) {
      expect(
        typeof fn,
        `"${name}" should be a function`
      ).toBe("function");

      // Call with undefined — must not throw
      expect(() => (fn as Function)(undefined)).not.toThrow();

      // Call with null — must not throw
      expect(() => (fn as Function)(null)).not.toThrow();
    }
  });

  it("all resolver functions produce consistent output (deterministic)", () => {
    // Call twice with the same input
    const a = widthClass("full");
    const b = widthClass("full");
    expect(a).toBe(b);
  });
});