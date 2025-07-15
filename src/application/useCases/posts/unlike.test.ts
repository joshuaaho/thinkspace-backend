import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createPostRepositoryMock,
} from "@utils/testData/mocks";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { NotLikedPostError } from "@domain/errors";
import UnlikePostUseCase from "@application/useCases/posts/unlike";
import {
  createUserOne,
  createPostOne,
  createUserTwo,
} from "@utils/testData/testEntities";

describe("Unlike Post Use Case", () => {
  describe("when unliking a post", async () => {
    const testUser = createUserTwo();
    const testPost = createPostOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const unlikePost = new UnlikePostUseCase(mockPostRepo);

    const result = await unlikePost.execute(
      {
        postId: testPost.id.value,
      },
      testUser,
    );

    it("should remove user from liked by array", () => {
      expect(testPost.likedBy.some((id) => id.equals(testUser.id))).toBe(false);
    });

    it("should save the post", () => {
      expect(mockPostRepo.save).toHaveBeenCalledWith(testPost);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when post is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(None);

    const unlikePost = new UnlikePostUseCase(mockPostRepo);

    const result = await unlikePost.execute(
      {
        postId: "nonexistentId",
      },
      testUser,
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when post is not liked", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const unlikePost = new UnlikePostUseCase(mockPostRepo);

    const result = await unlikePost.execute(
      {
        postId: testPost.id.value,
      },
      testUser,
    );

    it("should return not liked post error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(NotLikedPostError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });
});
