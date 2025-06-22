// import { describe, it, expect } from "vitest";
// import { createUserRepositoryMock } from "@utils/testData/mocks";
// import { None, Some } from "ts-results-es";
// import { createUserOne, createUserThree, createUserTwo } from "@utils/testData/testEntities";
// import FollowUserUseCase from "@application/useCases/users/follow";
// import {
//   ResourceNotFoundError,
//   InvalidRequestError,
//   UnauthenticatedError,
// } from "@application/useCases/errors";
// import FollowUser from "@application/useCases/users/follow";

// describe("Follow User Use Case", () => {
//   describe("when following a user", async () => {
//     const testUser = createUserThree();
//     const userToFollow = createUserOne();

//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(Some(userToFollow));

//     const followUserUseCase = new FollowUserUseCase(mockUserRepo);

//     const result = await followUserUseCase.execute({
//       userToFollowId: userToFollow.id.value,
//     },testUser);

//     it("should add a new follow to the user", async () => {
//       expect(userToFollow.followedBy.some((id) => id.equals(testUser.id))).toBe(true);
//     });
//     it("should save the updated user being followed", async () => {
//       expect(mockUserRepo.save).toHaveBeenCalledWith(userToFollow);
//     });

//     it("should return success", async () => {
//       expect(result.isOk()).toBe(true);
//     });
//   });


//   describe("when user to follow does not exist", async () => {
//     const testUser = createUserTwo();
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(None);

//     const followUserUseCase = new FollowUserUseCase(mockUserRepo);

//     const result = await followUserUseCase.execute({
//       userToFollowId: "nonexistentId",
//     },testUser);

//     it("should return resource not found error", async () => {
//       expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
//     });
//   });

//   describe("when already following the user", async () => {
//     const testUser = createUserTwo();
//     const userToFollow = createUserOne(); // userOne is already followed by userTwo

//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(Some(userToFollow));

//     const followUserUseCase = new FollowUserUseCase(mockUserRepo);
//     const result = await followUserUseCase.execute({
//       requestorId: testUser.id.value,
//       userToFollowId: userToFollow.id.value,
//     });
//     it("should return invalid request error", async () => {
//       expect(result.unwrapErr()).toBeInstanceOf(InvalidRequestError);
//     });

 
//   });
// });
