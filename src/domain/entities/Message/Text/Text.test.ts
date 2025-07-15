import { describe, it, expect } from "vitest";
import Text from "./index";
import { ValidationError } from "@domain/errors";

describe("Text", () => {
  describe("creating a valid text", () => {
    const result = Text.create("Valid message text");

    it("should have correct value", () => {
      expect(result.unwrap().value).toBe("Valid message text");
    });
  });

  describe("creating an invalid text", () => {
    it("should return validation error when text is empty", () => {
      const result = Text.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return validation error when text is only whitespace", () => {
      const result = Text.create("   ");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return validation error when text exceeds 5000 characters", () => {
      const result = Text.create("a".repeat(5001));
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("comparing texts", () => {
    const text1 = Text.create("same text").unwrap();
    const text2 = Text.create("same text").unwrap();
    const text3 = Text.create("different text").unwrap();

    it("should return true for equal texts", () => {
      expect(text1.equals(text2)).toBe(true);
    });

    it("should return false for different texts", () => {
      expect(text1.equals(text3)).toBe(false);
    });
  });
});
