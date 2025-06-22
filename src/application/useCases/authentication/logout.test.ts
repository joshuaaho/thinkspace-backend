import { describe, it, expect } from "vitest";
import { createUserRepositoryMock } from "@utils/testData/mocks";
import LogoutUseCase from "@application/useCases/authentication/logout";
import { Some } from "ts-results-es";
import { createUserOne } from "@utils/testData/testEntities";

describe("Logout Use Case", () => {
  describe("when logging out", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findByRefreshToken.mockResolvedValue(Some(testUser));

    const logoutUseCase = new LogoutUseCase(mockUserRepo);
    await logoutUseCase.execute({
      refreshToken: "testRefreshToken",
    });
    it("save the user", () => {
      expect(mockUserRepo.save).toHaveBeenCalledWith(testUser);
    });
    it("clear the refresh token", () => {
      expect(testUser.refreshToken).toBeUndefined();
    });
  });
});
