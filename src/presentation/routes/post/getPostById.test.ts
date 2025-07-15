import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import { createPostOne, createUserOne } from "@utils/testData/testEntities";
import IUserRepository from "@domain/repositories/IUserRepository";

describe("Get Post By Id Route", () => {
  describe("when post exists", () => {
    const testPost = createPostOne();
    const testUser = createUserOne();

    async function initializeData() {
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      await userRepository.save(testUser);
      await postRepository.save(testPost);
    }

    async function sendRequest() {
      return request(app).get(`/posts/${testPost.id.value}`);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.status).toBe(200);
    });

    it("should return post id", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("id", testPost.id.value);
    });

    it("should return post title", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("title", testPost.title.value);
    });

    it("should return post content", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("content", testPost.content.value);
    });

    it("should return post author id", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty("authorId", testPost.authorId.value);
    });

    it("should return post tags", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.body).toHaveProperty(
        "tags",
        testPost.tags.map((tag) => tag.value),
      );
    });
  });

  describe("when post does not exist", () => {
    async function sendRequest() {
      return request(app).get("/posts/non-existent-id");
    }

    it("should return 404 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });

    it("should return error message", async () => {
      const response = await sendRequest();
      expect(response.body).toHaveProperty("error", "Post not found");
    });
  });
});
