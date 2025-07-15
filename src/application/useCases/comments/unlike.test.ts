import { describe, it, expect } from "vitest";
import {
  createCommentRepositoryMock,
  createUserRepositoryMock,
} from "@utils/testData/mocks";

import { None, Some } from "ts-results-es";

import {
  createCommentOne,
  createUserOne,
  createUserTwo,
} from "@utils/testData/testEntities";
import UnlikeCommentUseCase from "@application/useCases/comments/unlike";
import { ResourceNotFoundError } from "@application/useCases/errors";
import { NotLikedCommentError } from "@domain/errors";

describe("Unlike Comment Use Case", () => {
  describe("successfully unliking a comment", async () => {
    const testComment = createCommentOne();
    const testUser = createUserTwo();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const unlikeCommentUseCase = new UnlikeCommentUseCase(mockCommentRepo);

    const result = await unlikeCommentUseCase.execute(
      {
        commentId: testComment.id.value,
      },
      testUser,
    );

    it("should remove user from liked by array", () => {
      expect(testComment.likedBy.some((id) => id.equals(testUser.id))).toBe(
        false,
      );
    });

    it("should save the comment", () => {
      expect(mockCommentRepo.save).toHaveBeenCalledWith(testComment);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when comment is not found", async () => {
    const testUser = createUserTwo();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(None);

    const unlikeCommentUseCase = new UnlikeCommentUseCase(mockCommentRepo);

    const result = await unlikeCommentUseCase.execute(
      {
        commentId: "nonexistentCommentId",
      },
      testUser,
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when user has not liked the comment", async () => {
    const testComment = createCommentOne();
    const testUser = createUserOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const unlikeCommentUseCase = new UnlikeCommentUseCase(mockCommentRepo);

    const result = await unlikeCommentUseCase.execute(
      {
        commentId: testComment.id.value,
      },
      testUser,
    );

    it("should return not liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(NotLikedCommentError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });
});
