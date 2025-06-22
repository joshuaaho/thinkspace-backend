import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import { createUserRepositoryMock, createCommentRepositoryMock } from "@utils/testData/mocks";
import { ResourceNotFoundError, UnauthenticatedError } from "@application/useCases/errors";
import { AlreadyLikedCommentError, SelfLikedCommentError } from "@domain/errors";
import LikeCommentUseCase from "@application/useCases/comments/like";
import { createUserOne, createUserTwo, createUserThree } from "@utils/testData/testEntities";
import { createCommentOne } from "@utils/testData/testEntities";
import { DomainEvents } from "@domain/events/DomainEvents";
import CommentLikedEvent from "@domain/events/CommentLiked";

describe("Like Comment Use Case", () => {
  describe("when liking a comment", async () => {
    const testUser = createUserThree();
    const testComment = createCommentOne();


    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const likeComment = new LikeCommentUseCase(mockCommentRepo);

    const result = await likeComment.execute({
      commentId: testComment.id.value,
    },testUser);

    it("should add user to liked by array", () => {
      expect(testComment.likedBy.some((id) => id.equals(testUser.id))).toBe(true);
    });

    it("should save the comment", () => {
      expect(mockCommentRepo.save).toHaveBeenCalledWith(testComment);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });

    it("mark the entity newly created entity", () => {
      expect(DomainEvents.getMarkedEntities().length).toBe(1);
    });

    it("entity should hold the event", () => {
      const domainEvent = DomainEvents.getMarkedEntities()[0].domainEvents[0];
      expect(domainEvent).toBeInstanceOf(CommentLikedEvent);
    });
  });

 

  describe("when comment is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(None);

    const likeComment = new LikeCommentUseCase(mockCommentRepo);

    const result = await likeComment.execute({
      commentId: "nonexistentId",
    },testUser);

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when liking own comment", async () => {
    const testUser = createUserOne();
    const testComment = createCommentOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

    const likeComment = new LikeCommentUseCase(mockCommentRepo);

    const result = await likeComment.execute({
      commentId: testComment.id.value,
    },testUser);

    it("should return self liked comment error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(SelfLikedCommentError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when comment is already liked", async () => {
    const testUser = createUserTwo();
    const testComment = createCommentOne();


    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(testComment));

        const likeComment = new LikeCommentUseCase(mockCommentRepo);

    const result = await likeComment.execute({
      commentId: testComment.id.value,
    },testUser);

    it("should return already liked comment error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(AlreadyLikedCommentError);
    });

    it("should not save the comment", () => {
      expect(mockCommentRepo.save).not.toHaveBeenCalled();
    });
  });
}); 