import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Create File Upload URL Route", () => {
  describe("when creating upload URL is successful", () => {
    const testUser = createUserOne();

    const initializeData = async () => {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .post("/files/upload-url")
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 200 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should return upload URL", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.body).toHaveProperty("uploadUrl");
    });
  });

  describe("creating upload URL without access token", () => {
    const sendRequest = async () => {
      return request(app).post("/files/upload-url");
    };

    it("should return 401 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("creating upload URL as nonexistent user", () => {
    const sendRequest = async () => {
      const accessToken = createAccessToken("nonexistent-user-id");
      return request(app)
        .post("/files/upload-url")
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 401 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });
});
