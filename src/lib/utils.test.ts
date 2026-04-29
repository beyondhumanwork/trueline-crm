import { describe, it, expect } from "vitest";
import { formatCurrency, sessionsOverlap } from "./utils";

describe("formatCurrency", () => {
  it("formats whole numbers", () => {
    expect(formatCurrency(150)).toBe("$150");
  });

  it("formats larger amounts", () => {
    expect(formatCurrency(4350)).toBe("$4,350");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("sessionsOverlap", () => {
  it("returns true when sessions overlap", () => {
    const s1 = new Date("2026-04-29T14:00:00");
    expect(sessionsOverlap(s1, 120, new Date("2026-04-29T15:00:00"), 60)).toBe(true);
  });

  it("returns false when sessions do not overlap", () => {
    const s1 = new Date("2026-04-29T09:00:00");
    const s2 = new Date("2026-04-29T11:00:00");
    expect(sessionsOverlap(s1, 120, s2, 60)).toBe(false);
  });

  it("returns false when sessions are adjacent", () => {
    const s1 = new Date("2026-04-29T09:00:00");
    const s2 = new Date("2026-04-29T11:00:00");
    expect(sessionsOverlap(s1, 120, s2, 60)).toBe(false);
  });
});
