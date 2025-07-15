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

describe("Unfollow User Route", () => {
  describe("when unfollowing a user is successful", () => {
    const testUser = createUserTwo();
    const userToUnfollow = createUserOne();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
      await userRepository.save(userToUnfollow);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .post(`/users/${userToUnfollow.id.value}/unfollow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 200 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should remove user from followed list", async () => {
      await initializeData();
      await sendRequest();
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const updatedUserToUnfollow = (
        await userRepository.findById(userToUnfollow.id.value)
      ).unwrap();
      expect(updatedUserToUnfollow.isFollowedBy(testUser.id)).toBe(false);
    });
  });

  describe("unfollowing without access token", () => {
    const sendRequest = async () => {
      return request(app).post(`/users/someUserId/unfollow`);
    };

    it("should return 401 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when user to unfollow does not exist", () => {
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
        .post("/users/nonexistentid/unfollow")
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 404 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to unfollow yourself", () => {
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
        .post(`/users/${testUser.id.value}/unfollow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when not following the user", () => {
    const testUser = createUserThree();
    const userToUnfollow = createUserOne();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
      await userRepository.save(userToUnfollow);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(testUser.id.value);
      return request(app)
        .post(`/users/${userToUnfollow.id.value}/unfollow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when user to unfollow is not found", () => {
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
        .post(`/users/nonexistentid/unfollow`)
        .set("Authorization", `Bearer ${accessToken}`);
    };

    it("should return 404 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });
});
