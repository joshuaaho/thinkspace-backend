// import { describe, it, expect } from "vitest";
// import request from "supertest";
// import app from "@index";
// import container from "@container";
// import IUserRepository from "@domain/repositories/IUserRepository";
// import SERVICES from "@utils/containers/containerServices";
// import {
//   createUserOne,
//   createUserTwo,
// } from "@utils/testData/testEntities";
// import { createAccessToken } from "@utils/testData/infastructure";

// describe("Unfollow User Route", () => {
//   describe("when unfollowing a user is successful", () => {
//     const testUser = createUserTwo();
//     const userToUnfollow = createUserOne(); // userOne is already followed by userTwo

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(testUser);
//       await userRepository.save(userToUnfollow);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(testUser.id.value);
//       return request(app)
//         .delete(`/users/${userToUnfollow.id.value}/follow`)
//         .set("Authorization", `Bearer ${accessToken}`);
//     };

//     it("should return 200 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(200);
//     });

//     it("should return success message", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.body.message).toBe("Successfully unfollowed user");
//     });

//     it("should remove user from followed list", async () => {
//       await initializeData();
//       await sendRequest();
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       const updatedUserToUnfollow = (
//         await userRepository.findById(userToUnfollow.id.value)
//       ).unwrap();
//       expect(updatedUserToUnfollow.isFollowedBy(testUser.id)).toBe(false);
//     });
//   });

//   describe("unfollowing without access token", () => {
//     const sendRequest = async () => {
//       return request(app).delete(`/users/someUserId/follow`);
//     };

//     it("should return 401 status", async () => {
//       const response = await sendRequest();
//       expect(response.status).toBe(401);
//     });
//   });

//   describe("when user to unfollow does not exist", () => {
//     const testUser = createUserTwo();

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(testUser);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(testUser.id.value);
//       return request(app)
//         .delete("/users/nonexistentid/follow")
//         .set("Authorization", `Bearer ${accessToken}`);
//     };

//     it("should return 404 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(404);
//     });
//   });

//   describe("when trying to unfollow yourself", () => {
//     const testUser = createUserTwo();

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(testUser);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(testUser.id.value);
//       return request(app)
//         .delete(`/users/${testUser.id.value}/follow`)
//         .set("Authorization", `Bearer ${accessToken}`);
//     };

//     it("should return 400 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(400);
//     });


//   });

//   describe("when not following the user", () => {
//     const testUser = createUserTwo();
//     const userToUnfollow = createUserTwo(); // A new user that testUser is not following

//     const initializeData = async () => {
//       const userRepository = container.get<IUserRepository>(
//         SERVICES.UserRepository
//       );
//       await userRepository.save(testUser);
//       await userRepository.save(userToUnfollow);
//     };

//     const sendRequest = async () => {
//       const accessToken = createAccessToken(testUser.id.value);
//       return request(app)
//         .delete(`/users/${userToUnfollow.id.value}/follow`)
//         .set("Authorization", `Bearer ${accessToken}`);
//     };

//     it("should return 400 status", async () => {
//       await initializeData();
//       const response = await sendRequest();
//       expect(response.status).toBe(400);
//     });

//   });
// }); 