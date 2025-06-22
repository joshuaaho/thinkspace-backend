import { describe, it, expect } from "vitest";
import Url from "@domain/common/Url";
import { ValidationError } from "@domain/errors";

describe("Url", () => {
  describe("create valid url", () => {
    const result = Url.create("https://example.com").unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("https://example.com");
    });
  });

  describe("create invalid url", () => {
    it("should return validation error", () => {
      const result = Url.create("notaurl");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("compare urls", () => {
    const url1 = Url.create("https://example.com").unwrap();
    const url2 = Url.create("https://example.com").unwrap();
    const url3 = Url.create("https://different.com").unwrap();

    it("should return true for equal urls", () => {
      expect(url1.equals(url2)).toBe(true);
    });

    it("should return false for different urls", () => {
      expect(url1.equals(url3)).toBe(false);
    });
  });
});
