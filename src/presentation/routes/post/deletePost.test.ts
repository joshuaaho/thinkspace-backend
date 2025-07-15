import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createPostOne,
  createUserTwo,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";
import ICommentRepository from "@domain/repositories/ICommentRepository";

describe("Delete Post Route", () => {
  describe("when deleting post successfully", () => {
    const testPost = createPostOne();
    const testUser = createUserOne();
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
        .delete(`/posts/${testPost.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should remove post from database", async () => {
      await initializeData();
      await sendRequest();
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );
      const posts = await postRepository.query({ title: testPost.title.value });
      expect(posts).toHaveLength(0);
    });

    it("should remove all comments from database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );
      await vi.waitFor(async () => {
        const comments = await commentRepository.query({
          postId: testPost.id.value,
        });
        expect(comments).toHaveLength(0);
      });
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );
      const testPost = createPostOne();
      await postRepository.save(testPost);

      return request(app).delete(`/posts/${testPost.id.value}`);
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when post does not exist", () => {
    async function sendRequest() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const testUser = createUserOne();
      const accessToken = createAccessToken(testUser.id.value);
      await userRepository.save(testUser);

      return request(app)
        .delete("/posts/nonexistentpostid")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 404 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when trying to delete another user's post", () => {
    async function sendRequest() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const postRepository = iocContainer.get<IPostRepository>(
        CONSTANTS.PostRepository,
      );

      const testUser = createUserTwo();
      const testPost = createPostOne();
      const accessToken = createAccessToken(testUser.id.value);
      await userRepository.save(testUser);
      await postRepository.save(testPost);

      return request(app)
        .delete(`/posts/${testPost.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 403 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(403);
    });
  });
});
