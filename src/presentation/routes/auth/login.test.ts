import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";

describe("Login Route", () => {
  describe("when credentials are valid", () => {
    const testUser = createUserOne();
    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
    };

    const sendRequest = async () => {
      return request(app).post("/auth/login").send({
        username: testUser.username.value,
        password: "SecurePass123!",
      });
    };

    it("should return 200 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should return access token", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should set jwt cookie", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.headers["set-cookie"][0]).toContain("jwt=");
    });
  });
});

describe("when credentials are invalid", () => {
  const sendRequest = async () => {
    return request(app).post("/auth/login").send({
      username: "nonexistentuser",
      password: "wrongpassword",
    });
  };

  it("should return 401 status", async () => {
    const response = await sendRequest();
    expect(response.status).toBe(401);
  });
});

describe("when HTTP request is invalid (Plain Text)", () => {
  async function sendRequest() {
    return request(app)
      .post("/auth/login")
      .set("Content-Type", "text/plain")
      .send('{"username": "userOne", "password": "WrongPassword123!"}');
  }

  it("should return 400 status", async () => {
    const response = await sendRequest();
    expect(response.status).toBe(400);
  });
});
