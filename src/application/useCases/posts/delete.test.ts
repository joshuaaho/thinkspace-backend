import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createPostRepositoryMock,
} from "@utils/testData/mocks";
import {
  UnauthorizedError,
  ResourceNotFoundError,
} from "@application/useCases/errors";
import DeletePostUseCase from "@application/useCases/posts/delete";
import {
  createUserOne,
  createPostOne,
  createUserTwo,
} from "@utils/testData/testEntities";

describe("Delete Post Use Case", () => {
  describe("when deleting a post as author", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const deletePost = new DeletePostUseCase(mockPostRepo);

    const result = await deletePost.execute(
      {
        postId: testPost.id.value,
      },
      testUser
    );

    it("should delete the post", () => {
      expect(mockPostRepo.delete).toHaveBeenCalledWith(testPost.id);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when user is not authorized", async () => {
    const testUser = createUserTwo();
    const testPost = createPostOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const deletePost = new DeletePostUseCase(mockPostRepo);

    const result = await deletePost.execute(
      {
        postId: testPost.id.value,
      },
      testUser
    );

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not delete the post", () => {
      expect(mockPostRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe("when post is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(None);

    const deletePost = new DeletePostUseCase(mockPostRepo);

    const result = await deletePost.execute(
      {
        postId: "nonexistentId",
      },
      testUser
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not delete the post", () => {
      expect(mockPostRepo.delete).not.toHaveBeenCalled();
    });
  });
});
