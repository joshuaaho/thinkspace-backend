import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import CONSTANTS from "@containers/constants";
import { createUserOne, createCommentOne, createUserTwo } from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Unlike Comment Route", () => {
  describe("when unliking comment successfully", () => {
    const testUser = createUserTwo();
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
        .post(`/comments/${testComment.id.value}/unlike`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 200 status code", async () => {
      await initializeData();
      // Like the comment first
      await request(app)
        .post(`/comments/${testComment.id.value}/like`)
        .set("Authorization", `Bearer ${createAccessToken(testUser.id.value)}`);
      // Then unlike it
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should remove user from comment's likedBy array", async () => {
      await initializeData();
      // Like the comment first
      await request(app)
        .post(`/comments/${testComment.id.value}/like`)
        .set("Authorization", `Bearer ${createAccessToken(testUser.id.value)}`);
      // Then unlike it
      await sendRequest();
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );
      const updatedComment = await commentRepository.findById(testComment.id.value);
      expect(updatedComment.isSome()).toBe(true);
      expect(updatedComment.unwrap().likedBy.some(id => id.equals(testUser.id))).toBe(false);
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
      return request(app)
        .post(`/comments/${testComment.id.value}/unlike`);
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
        .post("/comments/nonexistentcommentid/unlike")
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when user has not liked the comment", () => {
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
        .post(`/comments/${testComment.id.value}/unlike`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
}); 