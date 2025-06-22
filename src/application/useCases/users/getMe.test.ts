// import { describe, it, expect } from "vitest";
// import { None, Some } from "ts-results-es";
// import { createUserRepositoryMock } from "@utils/testData/mocks";
// import { UnauthenticatedError } from "@application/useCases/errors";
// import { createUserOne } from "@utils/testData/testEntities";
// import GetMeUseCase from "./getMe";

// describe("Get Me Use Case", () => {
//   describe("when user is authenticated", async () => {
//     const testUser = createUserOne();
    
//     const mockUserRepo = createUserRepositoryMock();
//     mockUserRepo.findById.mockResolvedValue(Some(testUser));

//     const getMe = new GetMeUseCase(mockUserRepo);

//     const result = await getMe.execute({
//         requestorId: testUser.id.value,
//     });

//     // it("should return user data", () => {
//     //   expect(result.isOk()).toBe(true);
//     //   const user = result.unwrap();
//     //   expect(user.id.value).toBe(testUser.id.value);
//     //   expect(user.email).toBe(testUser.email);
//     //   expect(user.username).toBe(testUser.username);
//     // });
//   });

