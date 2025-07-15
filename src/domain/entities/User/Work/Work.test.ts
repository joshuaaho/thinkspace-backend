import { describe, it, expect } from "vitest";
import Work from "./index";
import { ValidationError } from "@domain/errors";

describe("Work Value Object", () => {
  describe("create valid work", () => {
    const result = Work.create(
      "Senior Software Engineer at Tech Corp",
    ).unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("Senior Software Engineer at Tech Corp");
    });
  });

  describe("create invalid work", () => {
    it("should return error for empty work", () => {
      const result = Work.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for work exceeding 200 characters", () => {
      const longWork = "a".repeat(201);
      const result = Work.create(longWork);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
