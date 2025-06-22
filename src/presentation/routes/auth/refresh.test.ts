import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";
import { createRefreshToken } from "@utils/testData/infastructure";

describe("Refresh Route", () => {


  describe("when refresh is successful", () => {
    
      const testUser = createUserOne();
  const refreshToken =   createRefreshToken(testUser.id.value);
  testUser.refreshToken = refreshToken;

  const initializeData = async () => {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
    await userRepository.save(testUser);
  };
    const sendRequest = async () => {
      return request(app)
        .post("/auth/refresh")
        .set("Cookie", `jwt=${refreshToken}`);
    };

    it("should return 201 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should return new access token", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("when refresh token is invalid", () => {
    const sendRequest = async () => {
      return request(app)
        .post("/auth/refresh")
        .set("Cookie", ["jwt=invalid-token"]);
    };

    it("should return 400 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when no refresh token is provided", () => {
    const sendRequest = async () => {
      return request(app).post("/auth/refresh");
    };

    it("should return 400 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
