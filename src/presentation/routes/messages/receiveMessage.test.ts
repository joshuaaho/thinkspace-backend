import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@index";
import { iocContainer } from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import SERVICES from "@containers/constants";
import { createUserOne, createUserTwo } from "@utils/testData/testEntities";
import { createAccessToken } from "@utils/testData/infastructure";
import { vi } from "vitest";
import { initializeClientSocket } from "@utils/testData/infastructure";

describe("Receive Message Route", () => {
  describe("when receiving a message is successful", () => {
    const sender = createUserOne();
    const receiver = createUserTwo();
    const messageContent = "Hello, this is a test message";

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        SERVICES.UserRepository,
      );
      await userRepository.save(sender);
      await userRepository.save(receiver);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(sender.id.value);
      return request(app)
        .post("/messages")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          recipientId: receiver.id.value,
          text: messageContent,
        });
    };

    async function listenForNotification() {
      const receiverAccessToken = createAccessToken(receiver.id.value);

      const receiverClientSocket =
        await initializeClientSocket(receiverAccessToken);
      return receiverClientSocket;
    }
    it("should return 200 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(200);
    });

    it("should save message in database", async () => {
      await initializeData();
      await sendRequest();
      const messageRepository = iocContainer.get<IMessageRepository>(
        SERVICES.MessageRepository,
      );
      const messages = await messageRepository.query({
        participantIds: [sender.id.value, receiver.id.value],
      });

      expect(messages.length).toBe(1);
      expect(messages[0].text.value).toBe(messageContent);
    });

    it("should send notification to receiver", async () => {
      let socketResponse: any;
      await initializeData();
      const receiverClientSocket = await listenForNotification();

      receiverClientSocket.on("newChatMessage", (notification) => {
        socketResponse = notification;
      });
      await sendRequest();

      await vi.waitFor(async () => {
        expect(socketResponse).toBeDefined();
      });
    });
  });

  describe("sending message without access token", () => {
    const sendRequest = async () => {
      return request(app).post("/messages").send({
        recipientId: "someUserId",
        text: "Test message",
      });
    };

    it("should return 401 status", async () => {
      const response = await sendRequest();
      expect(response.status).toBe(401);
    });
  });

  describe("when receiver does not exist", () => {
    const sender = createUserOne();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        SERVICES.UserRepository,
      );
      await userRepository.save(sender);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(sender.id.value);
      return request(app)
        .post("/messages")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          recipientId: "nonexistentid",
          text: "Test message",
        });
    };

    it("should return 404 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(404);
    });
  });

  describe("when message content is empty", () => {
    const sender = createUserOne();
    const receiver = createUserTwo();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        SERVICES.UserRepository,
      );
      await userRepository.save(sender);
      await userRepository.save(receiver);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(sender.id.value);
      return request(app)
        .post("/messages")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          recipientId: receiver.id.value,
          text: "",
        });
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });

  describe("when trying to send message to yourself", () => {
    const sender = createUserOne();

    const initializeData = async () => {
      const userRepository = iocContainer.get<IUserRepository>(
        SERVICES.UserRepository,
      );
      await userRepository.save(sender);
    };

    const sendRequest = async () => {
      const accessToken = createAccessToken(sender.id.value);
      return request(app)
        .post("/messages")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          recipientId: sender.id.value,
          text: "Test message",
        });
    };

    it("should return 400 status", async () => {
      await initializeData();
      const response = await sendRequest();
      expect(response.status).toBe(400);
    });
  });
});
