import { describe, it, expect } from "vitest";
import Education from "@domain/entities/User/Education";
import { ValidationError } from "@domain/errors";

describe("Education Value Object", () => {
  describe("create valid education", () => {
    const result = Education.create(
      "Bachelor of Science in Computer Science, University of Technology",
    ).unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe(
        "Bachelor of Science in Computer Science, University of Technology",
      );
    });
  });

  describe("create invalid education", () => {
    it("should return error for empty education", () => {
      const result = Education.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for education exceeding 300 characters", () => {
      const longEducation = "a".repeat(301);
      const result = Education.create(longEducation);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
