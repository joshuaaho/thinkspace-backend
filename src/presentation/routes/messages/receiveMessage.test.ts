// import { describe, it, expect } from "vitest";
// import request from "supertest";
// import app from "@index";
// import container from "@container";
// import IUserRepository from "@domain/repositories/IUserRepository";
// import IMessageRepository from "@domain/repositories/IMessageRepository";
// import SERVICES from "@utils/containers/containerServices";
// import {
//   createUserOne,
//   createUserTwo,
// } from "@utils/testData/testEntities";
// import { createAccessToken } from "@utils/testData/infastructure";

// describe("Receive Message Route", () => {
//   describe("when receiving a message is successful", () => {
//     const sender = createUserOne();
//     const receiver = createUserTwo();
//     const messageContent = "Hello, this is a test message";

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(sender);
//       await userRepository.save(receiver);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(sender.id.value);
//       return request(app)
//         .post("/messages")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({
//           recipientId: receiver.id.value,
//           text: messageContent
//         });
//     };

//     it("should return 200 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(200);
//     });

//     it("should return success message", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.body.message).toBe("ds");
//     });

//     it("should save message in database", async () => {
//       await initializeData();
//       await sendRequest();
//       const messageRepository = container.get<IMessageRepository>(
//         SERVICES.MessageRepository
//       );
//       const messages = await messageRepository.findAll();
//       const receiverMessages = messages.filter(
//         (message) => message.receiverId.value === receiver.id.value
//       );
//       expect(receiverMessages.length).toBe(1);
//       expect(receiverMessages[0].text.value).toBe(messageContent);
//     });
//   });

//   describe("sending message without access token", () => {
//     const sendRequest = async () => {
//       return request(app)
//         .post("/messages")
//         .send({
//           recipientId: "someUserId",
//           text: "Test message"
//         });
//     };

//     it("should return 401 status", async () => {
//       const response = await sendRequest();
//       expect(response.status).toBe(401);
//     });
//   });

//   describe("when receiver does not exist", () => {
//     const sender = createUserOne();

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(sender);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(sender.id.value);
//       return request(app)
//         .post("/messages")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({
//           recipientId: "nonexistentid",
//           text: "Test message"
//         });
//     };

//     it("should return 404 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(404);
//     });
//   });

//   describe("when message content is empty", () => {
//     const sender = createUserOne();
//     const receiver = createUserTwo();

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(sender);
//       await userRepository.save(receiver);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(sender.id.value);
//       return request(app)
//         .post("/messages")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({
//           recipientId: receiver.id.value,
//           text: ""
//         });
//     };

//     it("should return 400 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(400);
//     });
//   });

//   describe("when trying to send message to yourself", () => {
//     const sender = createUserOne();

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(sender);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(sender.id.value);
//       return request(app)
//         .post("/messages")
//         .set("Authorization", `Bearer ${accessToken}`)
//         .send({
//           recipientId: sender.id.value,
//           text: "Test message"
//         });
//     };

//     it("should return 400 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(400);
//     });
//   });
// });
