import { describe, it, expect } from "vitest";

import { UnauthenticatedError } from "@application/useCases/errors";

import {
  createUserRepositoryMock,
  createJwtServiceMock,
} from "@utils/testData/mocks";
import LoginUseCase from "@application/useCases/authentication/login";
import { None, Some } from "ts-results-es";
import { createUserOne } from "@utils/testData/testEntities";

describe("Login Use Case", () => {
  describe("when user is not found", async () => {
    const mockUserRepo = createUserRepositoryMock();
    const mockJwtService = createJwtServiceMock();
    const loginUseCase = new LoginUseCase(mockUserRepo, mockJwtService);
    mockUserRepo.findByUsername.mockResolvedValue(None);

    const result = await loginUseCase.execute({
      username: "testuser",
      password: "Test123!@#",
    });
    it("should return unauthenticated error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthenticatedError);
    });
  });

  describe("when user is found and password is correct", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    const mockJwtService = createJwtServiceMock();
    const loginUseCase = new LoginUseCase(mockUserRepo, mockJwtService);
    mockUserRepo.findByUsername.mockResolvedValue(Some(testUser));
    mockJwtService.createAccessToken.mockReturnValue("testAccessToken");
    mockJwtService.createRefreshToken.mockReturnValue("testRefreshToken");
    const result = await loginUseCase.execute({
      username: "userOne",
      password: "SecurePass123!",
    });
    it("should save the user", () => {
      expect(mockUserRepo.save).toHaveBeenCalledWith(testUser);
    });

    it("update the user with the refresh token", () => {
      expect(testUser.refreshToken).toBe("testRefreshToken");
    });
    it("should return tokens", () => {
      expect(result.unwrap()).toEqual({
        accessToken: "testAccessToken",
        refreshToken: "testRefreshToken",
      });
    });
  });

  describe("when password is incorrect", () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    const mockJwtService = createJwtServiceMock();
    const loginUseCase = new LoginUseCase(mockUserRepo, mockJwtService);
    mockUserRepo.findByUsername.mockResolvedValue(Some(testUser));

    it("should return unauthenticated error", async () => {
      const result = await loginUseCase.execute({
        username: "testuser",
        password: "WrongPassword",
      });
      expect(result.unwrapErr()).toBeInstanceOf(UnauthenticatedError);
    });
  });
});
