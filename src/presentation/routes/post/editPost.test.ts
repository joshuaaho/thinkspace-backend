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
  postOneUpdates,
  createUserTwo,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Edit Post Route", () => {
  describe("when editing post successfully", () => {
    const testPost = createPostOne();
    const testUser = createUserOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      const postRepository = container.get<IPostRepository>(CONSTANTS.PostRepository);

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/posts/${testPost.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(postOneUpdates);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should update post in database", async () => {
      await initializeData();
      await sendRequest();
      const postRepository = container.get<IPostRepository>(CONSTANTS.PostRepository);
      const posts = await postRepository.query({ title: postOneUpdates.title });
      expect(posts).toHaveLength(1);
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      return request(app)
        .patch(`/posts/somepostid`)
        .send({
          title: "Updated Title",
          content: "Updated content",
        });
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when post does not exist", () => {
    const testUser = createUserOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch("/posts/nonexistentpostid")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Updated Title",
          content: "Updated content",
        });
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to edit another user's post", () => {
    const testPost = createPostOne();
    const testUser = createUserTwo();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      const postRepository = container.get<IPostRepository>(CONSTANTS.PostRepository);

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/posts/${testPost.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "Updated Title",
          content: "Updated content",
        });
    }

    it("should return 403 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(403);
    });
  });

  describe("when invalid data is provided", () => {
    const testPost = createPostOne();
    const testUser = createUserOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
      const postRepository = container.get<IPostRepository>(CONSTANTS.PostRepository);

      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/posts/${testPost.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "",
          content: "",
        });
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
}); 
