import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "@index";
import container from "@containers/index";
import IPostRepository from "@domain/repositories/IPostRepository";

import { createUserOne, createUserTwo } from "@utils/testData/testEntities";
import {
  createAccessToken,
  initializeClientSocket,
} from "@utils/testData/infastructure";

import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";

describe("Create Post Route", () => {
  describe("when creating post successfully", () => {
    const testUser = createUserOne();
    const userTwo = createUserTwo();
    const postData = {
      title: "new post",
      content: "new post content",
      tags: ["test"],
      imgUrls: ["https://www.placehold.it/600x400"],
    };

    async function initializeData() {
      const userRepository = container.get<IUserRepository>(
        CONSTANTS.UserRepository
      );
      await userRepository.save(testUser);
      await userRepository.save(userTwo);
    }

    async function sendRequest() {
      const accessToken = createAccessToken(testUser.id.value);

      return request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(postData);
    }

    async function listenForNotification() {
      const userTwoAccessToken = createAccessToken(userTwo.id.value);

      const userTwoClientSocket = await initializeClientSocket(
        userTwoAccessToken
      );
      return userTwoClientSocket;
    }

    it("should return 201 status code", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(201);
    });

    it("should create post in database", async () => {
      await initializeData();
      await sendRequest();
      const postRepository = container.get<IPostRepository>(
        CONSTANTS.PostRepository
      );
      const posts = await postRepository.query({ title: postData.title });
      expect(posts).toHaveLength(1);
    });

    it("should send notification to followers", async () => {
      let socketResponse: any;
      await initializeData();
      const userTwoClientSocket = await listenForNotification();

      userTwoClientSocket.on("newNotification", (notification) => {
        socketResponse = notification;
      });

      await sendRequest();

      await vi.waitFor(async () => {
        expect(socketResponse).toBeDefined();
      });
    });
  });

  describe("when user is not authenticated", () => {
    async function sendRequest() {
      return request(app).post("/posts").send({
        title: "Test Post",
        content: "Test content",
      });
    }

    it("should return 401 status code", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when invalid data is provided", () => {
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
        .post("/posts")
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
