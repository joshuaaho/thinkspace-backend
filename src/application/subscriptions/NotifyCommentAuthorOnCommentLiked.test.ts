import { describe, it, expect, vi } from "vitest";
import NotifyCommentAuthorOnCommentLiked from "@application/subscriptions/NotifyCommentAuthorOnCommentLiked";
import {
  createUserRepositoryMock,
  createNotificationServiceMock,
  createNotificationRepositoryMock,
} from "@utils/testData/mocks";
import {
  createCommentOne,
  createUserOne,
  createUserTwo,
} from "@utils/testData/testEntities";
import { Some } from "ts-results-es";
import CommentLiked from "@domain/events/CommentLiked";

describe("Notify Comment Author On Comment Liked", () => {
  describe("when comment is liked by another user", async () => {
    const author = createUserOne();
    const comment = createCommentOne();
    const liker = createUserTwo();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValueOnce(Some(author));
    mockUserRepo.findById.mockResolvedValueOnce(Some(liker));

    const mockNotificationService = createNotificationServiceMock();
    const mockNotificationRepo = createNotificationRepositoryMock();

    const handler = new NotifyCommentAuthorOnCommentLiked(
      mockUserRepo,
      mockNotificationService,
      mockNotificationRepo
    );

    await handler.onCommentLiked(new CommentLiked(comment));

    it("should save the notification", () => {
      expect(mockNotificationRepo.save).toHaveBeenCalledOnce();
    });

    it("should send the notification", () => {
      expect(mockNotificationService.sendNotification).toHaveBeenCalledOnce();
    });
  });

  describe("when comment is liked by another user", async () => {
    const author = createUserOne();
    const comment = createCommentOne();
    const liker = createUserTwo();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValueOnce(Some(author));
    mockUserRepo.findById.mockResolvedValueOnce(Some(liker));

    const mockNotificationService = createNotificationServiceMock();
    const mockNotificationRepo = createNotificationRepositoryMock();

    const handler = new NotifyCommentAuthorOnCommentLiked(
      mockUserRepo,
      mockNotificationService,
      mockNotificationRepo
    );

    await handler.onCommentLiked(new CommentLiked(comment));

    it("should save the notification", () => {
      expect(mockNotificationRepo.save).toHaveBeenCalledOnce();
    });

    it("should send the notification", () => {
      expect(mockNotificationService.sendNotification).toHaveBeenCalledOnce();
    });
  });
});
