import { describe, it, expect } from "vitest";
import Interest from "./index";
import { ValidationError } from "@domain/errors";

describe("Interest Value Object", () => {
  describe("create valid interest", () => {
    const result = Interest.create("Programming, Reading, Hiking").unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("Programming, Reading, Hiking");
    });
  });

  describe("create invalid interest", () => {
    it("should return error for empty interest", () => {
      const result = Interest.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for interest exceeding 200 characters", () => {
      const longInterest = "a".repeat(201);
      const result = Interest.create(longInterest);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
