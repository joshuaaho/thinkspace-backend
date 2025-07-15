import { describe, it, expect } from "vitest";
import EntityId from "@domain/core/EntityId";

describe("EntityId", () => {
  describe("compare entity ids", () => {
    const id1 = EntityId.create("123");
    const id2 = EntityId.create("123");
    const id3 = EntityId.create("456");

    it("should return true for equal ids", () => {
      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different ids", () => {
      expect(id1.equals(id3)).toBe(false);
    });
  });
});
