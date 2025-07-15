import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";
import { createRefreshToken } from "@utils/testData/infastructure";

describe("Logout Route", () => {
  describe("when logout is successful", () => {
    const testUser = createUserOne();
    const refreshToken = createRefreshToken(testUser.id.value);
    testUser.refreshToken = refreshToken;

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
    };
    const sendRequest = async () => {
      return request(app)
        .post("/auth/logout")
        .set("Cookie", `jwt=${refreshToken}`);
    };

    it("should return 200 status", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.status).toBe(200);
    });

    it("should clear jwt cookie in the frontend", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.headers["set-cookie"][0]).toContain("jwt=;");
    });

    it("should remove refresh token from user", async () => {
      await initializeData();
      await sendRequest();
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const user = await userRepository.findByRefreshToken(refreshToken);
      expect(user.isNone()).toBe(true);
    });
  });
});
