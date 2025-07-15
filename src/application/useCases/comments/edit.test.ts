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
import EditCommentUseCase from "@application/useCases/comments/edit";
import {
  ResourceNotFoundError,
  UnauthorizedError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import Content from "@domain/entities/Comment/Content";

describe("Edit Comment Use Case", () => {
  describe("when editing a comment as author", async () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const editCommentUseCase = new EditCommentUseCase(mockCommentRepo);

    const result = await editCommentUseCase.execute(
      {
        commentId: testComment.id.value,
        content: "updated content",
      },
      testUser,
    );

    it("should update comment content", () => {
      expect(
        testComment.content.equals(Content.create("updated content").unwrap()),
      ).toBe(true);
    });

    it("should save the comment", () => {
      expect(mockCommentRepo.save).toHaveBeenCalledWith(testComment);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when comment is not found", async () => {
    const testUser = createUserOne();
    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(None);

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const editCommentUseCase = new EditCommentUseCase(mockCommentRepo);

    const result = await editCommentUseCase.execute(
      {
        commentId: "nonexistentCommentId",
        content: "updated content",
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

  describe("when user is not authorized", async () => {
    const testUser = createUserTwo();
    const testComment = createCommentOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const editCommentUseCase = new EditCommentUseCase(mockCommentRepo);

    const result = await editCommentUseCase.execute(
      {
        commentId: testComment.id.value,
        content: "updated content",
      },
      testUser,
    );

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when content is invalid", async () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const editCommentUseCase = new EditCommentUseCase(mockCommentRepo);

    const result = await editCommentUseCase.execute(
      {
        commentId: testComment.id.value,
        content: "a".repeat(1001),
      },
      testUser,
    );

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });
});
