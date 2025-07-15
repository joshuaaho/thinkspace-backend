import { describe, it, expect } from "vitest";
import { Err, None, Ok, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createJwtServiceMock,
} from "@utils/testData/mocks";
import {
  UnauthenticatedError,
  InvalidRequestError,
} from "@application/useCases/errors";
import { createUserOne } from "@utils/testData/testEntities";
import RefreshUseCase from "@application/useCases/authentication/refresh";

describe("Refresh Use Case", () => {
  describe("when user is not found", async () => {
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByRefreshToken.mockResolvedValue(None);

    const mockJwtService = createJwtServiceMock();
    const refreshUseCase = new RefreshUseCase(mockUserRepo, mockJwtService);

    const result = await refreshUseCase.execute({
      refreshToken: "invalid-refresh-token",
    });
    it("should return unauthenticated error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(InvalidRequestError);
    });

    it("should not create new tokens", () => {
      expect(mockJwtService.createAccessToken).not.toHaveBeenCalled();
    });
  });

  describe("when refresh token verification fails", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByRefreshToken.mockResolvedValue(Some(testUser));

    const mockJwtService = createJwtServiceMock();
    mockJwtService.verifyRefreshToken.mockReturnValue(
      Err(new UnauthenticatedError("Invalid refresh token")),
    );

    const refreshUseCase = new RefreshUseCase(mockUserRepo, mockJwtService);

    const result = await refreshUseCase.execute({
      refreshToken: "invalid-refresh-token",
    });

    it("should return unauthenticated error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthenticatedError);
    });
  });

  describe("success refresh", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByRefreshToken.mockResolvedValue(Some(testUser));

    const mockJwtService = createJwtServiceMock();
    mockJwtService.createAccessToken.mockReturnValue("new-access-token");
    mockJwtService.verifyRefreshToken.mockReturnValue(
      Ok({ userId: testUser.id.value }),
    );

    const refreshUseCase = new RefreshUseCase(mockUserRepo, mockJwtService);

    const result = await refreshUseCase.execute({
      refreshToken: "valid-refresh-token",
    });

    it("should return new access token", async () => {
      expect(result.unwrap()).toEqual({
        accessToken: "new-access-token",
      });
    });
  });
});
