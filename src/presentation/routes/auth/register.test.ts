import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne } from "@utils/testData/testEntities";

describe("Register Route", () => {
  

  describe("when registration is successful", () => {
    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: "newUser",
        email: "newuser@example.com",
        password: "SecurePass123!",
      });
    };

    it("should return 201 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should create user in database", async () => {
      await sendRequest();
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      const user = await userRepository.findByUsername("newUser");
      expect(user.isSome()).toBe(true);
    });
  });

  describe("when email format is invalid", () => {
    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: "newUser",
        email: "invalid-email",
        password: "SecurePass123!",
      });
    };

    it("should return 400 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when username format is invalid", () => {
    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: "a", // Too short
        email: "newuser@example.com",
        password: "SecurePass123!",
      });
    };

    it("should return 400 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when password format is invalid", () => {
    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: "newUser",
        email: "newuser@example.com",
        password: "weak", // Too weak
      });
    };

    it("should return 400 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when username already exists", () => {
    const testUser = createUserOne();

  const initializeData = async () => {
    const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
    await userRepository.save(testUser);
  };
    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: testUser.username.value,
        email: "different@example.com",
        password: "SecurePass123!",
      });
    };

    it("should return 409 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(409);
    });
  });

  describe("when email already exists", () => {
    const testUser = createUserOne();

    const initializeData = async () => {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      await userRepository.save(testUser);
    };

    const sendRequest = async () => {
      return request(app).post("/auth/register").send({
        username: "differentUser",
        email: testUser.email.value,
        password: "SecurePass123!",
      });
    };

    it("should return 409 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(409);
    });
  });
});
