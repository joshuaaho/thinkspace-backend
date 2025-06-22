import { ValidationError } from "@domain/errors";
import Password from "@domain/entities/User/Password";
import { describe, it, expect } from "vitest";
import { UnauthenticatedError } from "@application/useCases/errors";

describe("Password", () => {
  describe("create password", () => {
    it("should return validation error when password is too simple", () => {
      const result = Password.create({
        value: "Abc12!",
      });
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should verify correct password", async () => {
      const result = Password.create({
        value: "Abc12!111",
      }).unwrap();
      
      const someError = await result.verify("Abc12!111");
      expect(someError.isOk()).toBe(true);
    });

    it("should not verify incorrect password", async () => {
      const result = Password.create({
        value: "Abc12!111",
      }).unwrap();

      const someError = await result.verify("wrongpass");
      expect(someError.unwrapErr()).toBeInstanceOf(UnauthenticatedError);
    });
  });
});
