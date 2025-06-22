import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createCommentOne,
  createPostOne,
  createUserTwo,
  createUserThree,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";
import Comment from "@domain/entities/Comment";
import Content from "@domain/entities/Comment/Content";

describe("Like Comment Route", () => {
  describe("when liking comment successfully", () => {
    const testUser = createUserThree();
    const testComment = createCommentOne();
    const testUserOne = createUserOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
      await userRepository.save(testUserOne);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/comments/${testComment.id.value}/like`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 201 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should add user to comment's likedBy array", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      const updatedComment = await commentRepository.findById(
        testComment.id.value
      );
      expect(updatedComment.isSome()).toBe(true);
      expect(
        updatedComment.unwrap().likedBy.some((id) => id.equals(testUser.id))
      ).toBe(true);
    });
  });

  describe("when user is not authenticated", () => {
    const testComment = createCommentOne();

    async function initializeData() {
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      return request(app).post(`/comments/${testComment.id.value}/like`);
    }

    it("should return 401 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when comment does not exist", () => {
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
        .post("/comments/nonexistentcommentid/like")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when user has already liked the comment", () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/comments/${testComment.id.value}/like`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 400 status code", async () => {
      await initializeData();
      // Like the comment first time
      await sendRequest();
      // Try to like again
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when user tries to like their own comment", () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const testComment = Comment.create({
      authorId: testUser.id,
      content: Content.create("Test comment").unwrap(),
      postId: testPost.id,
    });

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post(`/comments/${testComment.id.value}/like`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
