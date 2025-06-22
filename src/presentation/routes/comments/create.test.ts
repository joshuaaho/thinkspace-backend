import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createPostOne,
  createCommentOne,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Create Comment Route", () => {
  describe("when creating comment successfully", () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const commentData = {
      postId: testPost.id.value,
      content: "This is a test comment",
    };

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
        .post("/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(commentData);
    }

    it("should return 201 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should create comment in database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      const comments = await commentRepository.query({
        postId: testPost.id.value,
      });
      expect(comments).toHaveLength(1);
    });
  });

  describe("when creating reply to another comment", () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const testComment = createCommentOne();
    const replyData = {
      postId: testPost.id.value,
      parentCommentId: testComment.id.value,
      content: "I am a reply to a comment",
    };

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await userRepository.save(testUser);
      await postRepository.save(testPost);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(replyData);
    }

    it("should return 201 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should create reply in database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      const comments = await commentRepository.query({
        postId: testPost.id.value,
      });
      expect(comments).toHaveLength(2);
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      return request(app).post("/comments").send({
        postId: "testpostid",
        content: "This is a test comment",
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
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          postId: "nonexistentpostid",
          content: "This is a test comment",
        });
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when parent comment does not exist", () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

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
        .post("/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          postId: testPost.id.value,
          content: "Reply comment",
          parentCommentId: "nonexistentcommentid",
        });
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when invalid data is provided", () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

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
        .post("/comments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          postId: testPost.id.value,
          content: "", // Empty content
        });
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });

    it("should not create comment in database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      const comments = await commentRepository.query({
        postId: testPost.id.value,
      });
      expect(comments).toHaveLength(0);
    });
  });
});
