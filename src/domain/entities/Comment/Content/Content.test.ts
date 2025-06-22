import Content from "@domain/entities/Comment/Content";
import { ValidationError } from "@domain/errors";
import { describe, it, expect } from "vitest";

describe('Content Entity', () => {
  describe('create valid content', () => {
    const result = Content.create("a".repeat(400)).unwrap();

    it('should have correct value', () => {
      expect(result.value).toBe("a".repeat(400));
    });
  });

  describe('create invalid content', () => {
    it('should return validation error for empty string', () => {
      const result = Content.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it('should return validation error for content exceeding 500 characters', () => {
      const result = Content.create("a".repeat(501));
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
