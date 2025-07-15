import { describe, it, expect } from "vitest";
import Bio from "./index";
import { ValidationError } from "@domain/errors";

describe("Bio Value Object", () => {
  describe("create valid bio", () => {
    const result = Bio.create(
      "Passionate software developer with 5 years of experience",
    ).unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe(
        "Passionate software developer with 5 years of experience",
      );
    });
  });

  describe("create invalid bio", () => {
    it("should return error for empty bio", () => {
      const result = Bio.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for bio exceeding 500 characters", () => {
      const longBio = "a".repeat(501);
      const result = Bio.create(longBio);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
