import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Get Me Route", () => {
  describe("when user is authenticated", () => {
    const testUser = createUserOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should return user id", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("id", testUser.id.value);
    });

    it("should return user email", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("email", testUser.email.value);
    });

    it("should return user username", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("username", testUser.username.value);
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      return request(app).get("/users/me");
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when user does not exist", () => {
    async function sendRequest() {
      const accessToken = createAccessToken("non-existent-user-id");
      return request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });
});
