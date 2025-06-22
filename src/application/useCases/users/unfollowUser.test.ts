// import { describe, it, expect } from "vitest";
// import { createUserRepositoryMock } from "@utils/testData/mocks";
// import { None, Some } from "ts-results-es";
// import {
//   createUserOne,
//   createUserTwo,
//   createUserThree,
// } from "@utils/testData/testEntities";
// import UnfollowUser from "./unfollow";
// import {
//   ResourceNotFoundError,
//   InvalidRequestError,
//   UnauthenticatedError,
// } from "@application/useCases/errors";

// describe("Unfollow User Use Case", () => {
//   describe("when unfollowing a user", async () => {
//     const testUser = createUserTwo();
//     const userToUnfollow = createUserOne(); // userOne is already followed by userTwo
    
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(Some(userToUnfollow));

//     const unfollowUserUseCase = new UnfollowUser(mockUserRepo);

//     const result = await unfollowUserUseCase.execute({
//       requestorId: testUser.id.value,
//       userToUnfollowId: userToUnfollow.id.value,
//     });

//     it("should remove the follow from the user being unfollowed", () => {
//       expect(userToUnfollow.followedBy.some((id) => id.equals(testUser.id))).toBe(false);
//     });
//     it("should save the user being unfollowed", () => {
//       expect(mockUserRepo.save).toHaveBeenCalledWith(userToUnfollow);
//     });

//     it("should return success", () => {
//       expect(result.isOk()).toBe(true);
//     });
//   });

//   describe("when requestor does not exist", async () => {
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById.mockReturnValue(None);

//     const unfollowUserUseCase = new UnfollowUser(mockUserRepo);

//     const result = await unfollowUserUseCase.execute({
//       requestorId: "nonexistentId",
//       userToUnfollowId: "someId",
//     });

//     it("should return unauthenticated error", () => {
//       expect(result.unwrapErr()).toBeInstanceOf(UnauthenticatedError);
//     });
//   });

//   describe("when user to unfollow does not exist", async () => {
//     const testUser = createUserTwo();
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(None);

//     const unfollowUserUseCase = new UnfollowUser(mockUserRepo);

//     const result = await unfollowUserUseCase.execute({
//       requestorId: testUser.id.value,
//       userToUnfollowId: "nonexistentId",
//     });

//     it("should return resource not found error", () => {
//       expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
//     });
//   });

//   describe("when not following the user", async () => {
//     const testUser = createUserThree();
//     const userToUnfollow = createUserOne();
    
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById
//       .mockReturnValueOnce(Some(testUser))
//       .mockReturnValueOnce(Some(userToUnfollow));

//     const unfollowUserUseCase = new UnfollowUser(mockUserRepo);

//     const result = await unfollowUserUseCase.execute({
//       requestorId: testUser.id.value,
//       userToUnfollowId: userToUnfollow.id.value,
//     });

//     it("should return invalid request error", () => {
//       expect(result.unwrapErr()).toBeInstanceOf(InvalidRequestError);
//     });


//   });
// }); 