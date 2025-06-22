import { describe, it, expect, vi } from "vitest";
import { ConflictError } from "@application/useCases/errors";
import { createUserRepositoryMock } from "@utils/testData/mocks";
import RegisterUseCase from "@application/useCases/authentication/register";
import { None, Some } from "ts-results-es";
import { createUserOne } from "@utils/testData/testEntities";
import { ValidationError } from "@domain/errors";

describe("Register Use Case", () => {
  describe("when registering with existing username", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByUsername.mockResolvedValue(Some(testUser));

    const registerUseCase = new RegisterUseCase(mockUserRepo);

    const result = await registerUseCase.execute({
      username: "userOne",
      password: "SecurePass123!",
      email: "test@example.com",
    });

    it("should return invalid request error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ConflictError);
    });
  });

  describe("when registering with valid credentials", async () => {
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByUsername.mockResolvedValue(None);
    mockUserRepo.findByEmail.mockResolvedValue(None);

    const registerUseCase = new RegisterUseCase(mockUserRepo);

    const result = await registerUseCase.execute({
      username: "newUser",
      password: "SecurePass123!",
      email: "test@example.com",
    });

    it("should save the new user", () => {
      expect(mockUserRepo.save).toHaveBeenCalled();
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when registering with invalid email", async () => {
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByUsername.mockResolvedValue(None);
    mockUserRepo.findByEmail.mockResolvedValue(None);

    const registerUseCase = new RegisterUseCase(mockUserRepo);

    const result = await registerUseCase.execute({
      username: "newUser",
      password: "SecurePass123!",
      email: "invalid-email",
    });

    it("should return invalid request error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("when registering with weak password", async () => {
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByUsername.mockResolvedValue(None);
    mockUserRepo.findByEmail.mockResolvedValue(None);

    const registerUseCase = new RegisterUseCase(mockUserRepo);

    const result = await registerUseCase.execute({
      username: "newUser",
      password: "weak",
      email: "test@example.com",
    });

    it("should return invalid request error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
});
