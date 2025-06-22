import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createPostOne,
  createUserTwo,
  createUserThree,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Unlike Post Route", () => {
  describe("when unliking post successfully", () => {
    const testPost = createPostOne();
    const testUser = createUserTwo();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/posts/${testPost.id.value}/unlike`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should remove user from post's likedBy array", async () => {
      await initializeData();
      await sendRequest();
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );
      const updatedPost = await postRepository.findById(testPost.id.value);
      expect(
        updatedPost.unwrap().likedBy.some((id) => id.equals(testUser.id))
      ).toBe(false);
    });
  });

  describe("when user is not authenticated", () => {
    const testPost = createPostOne();

    async function initializeData() {
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      return request(app).post(`/posts/${testPost.id.value}/unlike`);
    }

    it("should return 401 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when post does not exist", () => {
    const testUser = createUserTwo();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post("/posts/nonexistentpostid/unlike")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to unlike a non-liked post", () => {
    const testPost = createPostOne();
    const testUser = createUserThree();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/posts/${testPost.id.value}/unlike`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
