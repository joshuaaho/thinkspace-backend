import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import CONSTANTS from "@containers/constants";
import {
  createUserOne,
  createCommentOne,
  createUserTwo,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";

describe("Edit Comment Route", () => {
  describe("when editing comment successfully", () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();
    const updatedContent = "Updated comment content";

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/comments/${testComment.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: updatedContent,
        });
    }

    it("should return 200 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should update comment in database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );
      const updatedComment = (
        await commentRepository.findById(testComment.id.value)
      ).unwrap();
      expect(updatedComment.content.value).toBe(updatedContent);
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      return request(app).patch("/comments/testcommentid").send({
        content: "Updated comment content",
      });
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when user is not the author", () => {
    const testUser = createUserTwo();
    const testComment = createCommentOne();

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/comments/${testComment.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: "Updated comment content",
        });
    }

    it("should return 403 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(403);
    });

    it("should not update comment in database", async () => {
      await initializeData();
      await sendRequest();
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );
      const comment = (
        await commentRepository.findById(testComment.id.value)
      ).unwrap();
      expect(comment.content.value).toBe("Comment one content");
    });
  });

  describe("when comment does not exist", () => {
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
        .patch("/comments/nonexistentcommentid")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: "Updated comment content",
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
    const testComment = createCommentOne();

    async function initializeData() {
      const userRepository = iocContainer.get<IUserRepository>(
        CONSTANTS.UserRepository,
      );
      const commentRepository = iocContainer.get<ICommentRepository>(
        CONSTANTS.CommentRepository,
      );

      await userRepository.save(testUser);
      await commentRepository.save(testComment);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .patch(`/comments/${testComment.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: "a".repeat(1001),
        });
    }

    it("should return 400 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
