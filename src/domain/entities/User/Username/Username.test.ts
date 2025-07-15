import { ValidationError } from "@domain/errors";
import Username from "./index";

import { describe, it, expect } from "vitest";

describe("Username", () => {
  describe("creating a valid username", () => {
    const result = Username.create("validusername");

    it("should have correct value", () => {
      expect(result.unwrap().value).toBe("validusername");
    });
  });

  describe("creating an invalid username", () => {
    it("should return validation error when username is empty", () => {
      const result = Username.create("");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return validation error when username is too short", () => {
      const result = Username.create("ab");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return validation error when username is too long", () => {
      const result = Username.create("a".repeat(31));
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should return validation error when username contains invalid characters", () => {
      const result = Username.create("invalid username");
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("comparing usernames", () => {
    const username1 = Username.create("username1").unwrap();
    const username2 = Username.create("username1").unwrap();
    const username3 = Username.create("username2").unwrap();

    it("should return true for equal usernames", () => {
      expect(username1.equals(username2)).toBe(true);
    });

    it("should return false for different usernames", () => {
      expect(username1.equals(username3)).toBe(false);
    });
  });
});
