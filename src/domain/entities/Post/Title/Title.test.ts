import { describe, it, expect } from "vitest";
import Title from "@domain/entities/Post/Title";
import { ValidationError } from "@domain/errors";

describe("Title", () => {
  describe("create valid title", () => {
    const result = Title.create("My Valid Title").unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("My Valid Title");
    });
  });

  describe("create invalid title", () => {
    it("should return error for empty title", () => {
      const result = Title.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for whitespace title", () => {
      const result = Title.create("   ");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return error for title longer than 100 characters", () => {
      const longTitle = "a".repeat(101);
      const result = Title.create(longTitle);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
