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
import DeleteCommentUseCase from "@application/useCases/comments/delete";
import {
  ResourceNotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "@application/useCases/errors";
import { DomainEvents } from "@domain/events/DomainEvents";

describe("Delete Comment Use Case", () => {
  describe("when deleting a comment as author", async () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const deleteCommentUseCase = new DeleteCommentUseCase(mockCommentRepo);

    const result = await deleteCommentUseCase.execute(
      {
        commentId: testComment.id.value,
      },
      testUser
    );

    it("should delete the comment", () => {
      expect(mockCommentRepo.delete).toHaveBeenCalledWith(testComment.id);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });

    it("should mark the deleted comment", () => {
      expect(DomainEvents.getMarkedEntities().length).toBe(1);
    });
  });

  describe("when comment is not found", async () => {
    const testUser = createUserOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(None);

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const deleteCommentUseCase = new DeleteCommentUseCase(mockCommentRepo);

    const result = await deleteCommentUseCase.execute(
      {
        commentId: "nonexistentCommentId",
      },
      testUser
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not delete the comment", () => {
      expect(mockCommentRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe("when user is not authorized", async () => {
    const testUser = createUserTwo();
    const testComment = createCommentOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const deleteCommentUseCase = new DeleteCommentUseCase(mockCommentRepo);

    const result = await deleteCommentUseCase.execute(
      {
        commentId: testComment.id.value,
      },
      testUser
    );

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not delete the comment", () => {
      expect(mockCommentRepo.delete).not.toHaveBeenCalled();
    });
  });
});
