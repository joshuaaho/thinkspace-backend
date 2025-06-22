import { describe, it, expect, vi } from "vitest";
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
  createCommentOneReply,
  createCommentOneReplyReply,
} from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";
import Comment from "@domain/entities/Comment";
import Content from "@domain/entities/Comment/Content";
import IPostRepository from "@domain/repositories/IPostRepository";
import { None } from "ts-results-es";

describe("Delete Comment Route", () => {


  describe("when user is not authenticated", async () => {
    async function sendRequest() {
      return request(app).delete(`/comments/somecommentid`);
    }

    it("should return 401 when not authenticated", async () => {
      const response = await sendRequest();

      expect(response.status).toBe(401);
    });
  });

  describe("when user unathorized to delete comment", async () => {
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
        .delete(`/comments/${testComment.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }

    it("should return 403 status code", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.status).toBe(403);
    });

    it("comment should still exist", async () => {
      await initializeData();
      await sendRequest();

      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      const comment = await commentRepository.findById(testComment.id.value);
      expect(comment.isSome()).toBe(true);
    });
  });

  describe("when deleting a non existent comment", async () => {
    const testUser = createUserOne();
    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      const response = await request(app)
        .delete("/comments/nonexistentcommentid")
        .set("Authorization", `Bearer ${accessToken}`);
      return response;
    }
    it("should return 404 status code", async () => {
      await initializeData();
      const response = await sendRequest();

      expect(response.status).toBe(404);
    });
  });
  describe("when deleting a comment is successful", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

    const commentOne = createCommentOne();
    const commentOneReply = createCommentOneReply();
    const commentOneReplyReply = createCommentOneReplyReply();

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );

      // Create parent comment
      await commentRepository.save(commentOne);
      await commentRepository.save(commentOneReply);
      await commentRepository.save(commentOneReplyReply);
      await postRepository.save(testPost);
      await userRepository.save(testUser);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .delete(`/comments/${commentOne.id.value}`)
        .set("Authorization", `Bearer ${accessToken}`);
    }
    it("should return 204", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(204);
    });

    it("should delete direct reply", async () => {
      await initializeData();
      await sendRequest();

      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await vi.waitFor(
        async () => {
          expect(
            await commentRepository.findById(commentOneReply.id.value)
          ).toBe(None);
        },
        {
          timeout: 10000, // default is 1000
        }
      );
    });

    it("should delete nested reply", async () => {
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await initializeData();

      await sendRequest();

      await vi.waitFor(
        async () => {
          expect(
            await commentRepository.findById(commentOneReplyReply.id.value)
          ).toBe(None);
        },
        {
          timeout: 10000, // default is 1000
        }
      );
    });

    it("should delete main comment", async () => {
      const commentRepository = container.get<ICommentRepository>(
        CONSTANTS.CommentRepository
      );

      await initializeData();

      await sendRequest();

      expect(await commentRepository.findById(commentOne.id.value)).toBe(None);
    });
  });
});
