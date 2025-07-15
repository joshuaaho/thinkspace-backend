import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createPostOne,
  createUserThree,
  createUserTwo,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Like Post Route", () => {
  describe("when liking post successfully", () => {
    const testPost = createPostOne();
    const testUser = createUserThree();
    const testUserOne = createUserOne();

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );

      await userRepository.save(testUser);
      await postRepository.save(testPost);
      await userRepository.save(testUserOne);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/posts/${testPost.id.value}/like`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 201 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should add user to post's likedBy array", async () => {
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );
      await initializeData();
      await sendRequest();
      const updatedPost = await postRepository.findById(testPost.id.value);
      expect(
        updatedPost.unwrap().likedBy.some((id) => id.equals(testUser.id)),
      ).toBe(true);
    });
  });

  describe("when user is not authenticated", () => {
    const testPost = createPostOne();

    async function initializeData() {
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      return request(app).post(`/posts/${testPost.id.value}/like`);
    }

    it("should return 401 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when post does not exist", () => {
    const testUser = createUserOne();

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post("/posts/nonexistentpostid/like")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to like the same post twice", () => {
    const testPost = createPostOne();
    const testUser = createUserTwo();

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/posts/${testPost.id.value}/like`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
