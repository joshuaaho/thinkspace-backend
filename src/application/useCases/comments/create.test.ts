import { describe, it, expect } from "vitest";
import {
  createCommentRepositoryMock,
  createPostRepositoryMock,
  createUserRepositoryMock,
} from "@utils/testData/mocks";

import { None, Some } from "ts-results-es";

import {
  createCommentOne,
  createPostOne,
  createPostTwo,
  createUserOne,
} from "@utils/testData/testEntities";
import CreateCommentUseCase from "@application/useCases/comments/create";
import {
  ResourceNotFoundError,
  UnauthenticatedError,
  InvalidRequestError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";

describe("Create Comment Use Case", () => {
  describe("when creating a comment", async () => {
    const testPost = createPostOne();
    const testUser = createUserOne();

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();

    const createCommentUseCase = new CreateCommentUseCase(
      mockCommentRepo,

      mockPostRepo
    );

    const result = await createCommentUseCase.execute({
      postId: testPost.id.value,
      content: "New Comment Hello World",
    },testUser);

    it("should save the comment", () => {
      expect(mockCommentRepo.save).toHaveBeenCalled();
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });

  describe("when comment is invalid", async () => {
    const testPost = createPostOne();
    const testUser = createUserOne();

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();

    const createCommentUseCase = new CreateCommentUseCase(
      mockCommentRepo,
      mockPostRepo
    );

    const result = await createCommentUseCase.execute(
      {
        postId: testPost.id.value,
        content: "",
      },
      testUser
    );

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });


  describe("when post is not found", async () => {
    const testUser = createUserOne();

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(None);

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();

    const createCommentUseCase = new CreateCommentUseCase(
      mockCommentRepo,

      mockPostRepo
    );

    const result = await createCommentUseCase.execute({
      postId: "somePostId",
      content: "a".repeat(1001),
    },testUser);

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when parent comment is not found", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(None);

    const createCommentUseCase = new CreateCommentUseCase(
      mockCommentRepo,

      mockPostRepo
    );

    const result = await createCommentUseCase.execute({
      postId: testPost.id.value,
      content: "some content",
      parentCommentId: "someParentCommentId",
    },testUser);

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when parent comment does not belong to post", async () => {
    const testUser = createUserOne();
    const testPost = createPostTwo();
    const testComment = createCommentOne();

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const createCommentUseCase = new CreateCommentUseCase(
      mockCommentRepo,

      mockPostRepo
    );

    const result = await createCommentUseCase.execute({
      postId: testPost.id.value,
      content: "some content",
      parentCommentId: testComment.id.value,
    },testUser);

    it("should return invalid request error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(InvalidRequestError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });
});
