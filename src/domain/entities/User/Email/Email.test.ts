import { describe, it, expect } from "vitest";
import Email from "@domain/entities/User/Email";
import { ValidationError } from "@domain/errors";

describe("Email", () => {
  describe("create valid email", () => {
    const result = Email.create("test@example.com").unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("test@example.com");
    });
  });

  describe("create invalid emails", () => {
    const invalidEmails = [
      "",
      "notanemail",
      "@nocontent.com",
      "missing@domain",
    ];

    invalidEmails.forEach((email) => {
      it(`should throw ValidationError for "${email}"`, () => {
        const result = Email.create(email);
        expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
      });
    });
  });

  describe("compare emails", () => {
    const email1 = Email.create("test@example.com").unwrap();
    const email2 = Email.create("test@example.com").unwrap();
    const email3 = Email.create("other@example.com").unwrap();

    it("should return true for equal emails", () => {
      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false for different emails", () => {
      expect(email1.equals(email3)).toBe(false);
    });
  });
});
