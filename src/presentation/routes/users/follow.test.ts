import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createUserThree,
  createUserTwo,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Follow User Route", () => {
  describe("when following a user is successful", () => {
    const testUser = createUserThree();
    const userToFollow = createUserOne();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
      await userRepository.save(userToFollow);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .post(`/users/${userToFollow.id.value}/follow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 201 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should add user to followed list", async () => {
      await initializeData();
      await sendRequest();
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const updatedUserToFollow = (
        await userRepository.findById(userToFollow.id.value)
      ).unwrap();
      expect(updatedUserToFollow.isFollowedBy(testUser.id)).toBe(true);
    });
  });

  describe("following without access token", () => {
    const sendRequest = async () => {
      return request(app).post(`/users/someUserId/follow`);
    };

    it("should return 401 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when user to follow does not exist", () => {
    const testUser = createUserTwo();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .post("/users/nonexistentid/follow")
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 404 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to follow yourself", () => {
    const testUser = createUserTwo();
    const accessToken = createAccessToken(testUser.id.value);

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
    };

    const sendRequest = async () => {
      return request(app)
        .post(`/users/${testUser.id.value}/follow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when already following the user", () => {
    const testUser = createUserTwo();
    const userToFollow = createUserOne();
    const accessToken = createAccessToken(testUser.id.value);

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
      await userRepository.save(userToFollow);
    };

    const sendRequest = async () => {
      return request(app)
        .post(`/users/${userToFollow.id.value}/follow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
