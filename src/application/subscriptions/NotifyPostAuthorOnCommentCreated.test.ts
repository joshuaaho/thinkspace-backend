import { createNotificationRepositoryMock } from "@utils/testData/mocks";
import { createNotificationServiceMock } from "@utils/testData/mocks";
import { createPostRepositoryMock } from "@utils/testData/mocks";
import { createCommentOne, createCommentTwo } from "@utils/testData/testEntities";
import { Some } from "ts-results-es";
import { createPostOne } from "@utils/testData/testEntities";
import { createUserOne, createUserTwo } from "@utils/testData/testEntities";
import { createUserRepositoryMock } from "@utils/testData/mocks";
import { describe, it, expect } from "vitest";
import CommentCreated from "@domain/events/CommentCreated";
import NotifyPostAuthorOnCommentCreation from "@application/subscriptions/NotifyPostAuthorOnCommentCreated";

  describe("Notify Post Author On Comment Creation", async () => {
    describe("when a user comments on a another user's post", async () => {
  const postAuthor = createUserOne();
  const commenter = createUserTwo();
  const post = createPostOne();
  const comment = createCommentTwo();

  const mockUserRepo = createUserRepositoryMock();
  mockUserRepo.findById
    .mockResolvedValueOnce(Some(commenter))  // comment author
    .mockResolvedValueOnce(Some(postAuthor)); // post author

  const mockPostRepo = createPostRepositoryMock();
  mockPostRepo.findById.mockResolvedValue(Some(post));

  const mockNotificationService = createNotificationServiceMock();
  const mockNotificationRepo = createNotificationRepositoryMock();

  const handler = new NotifyPostAuthorOnCommentCreation(
    mockUserRepo,
    mockPostRepo,
    mockNotificationService,
    mockNotificationRepo
  );

  await handler.onCommentCreated(new CommentCreated(comment));

  it("should save the notification", () => {
    expect(mockNotificationRepo.save).toHaveBeenCalledTimes(1);
  });

  it("should send the notification", () => {
    expect(mockNotificationService.sendNotification).toHaveBeenCalledTimes(1);
  });
  });

  describe("when a user comments on a a ", async () => {
    const postAuthor = createUserOne();

    const post = createPostOne();
    const comment = createCommentOne();
  
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(postAuthor))  // comment author
      .mockResolvedValueOnce(Some(postAuthor)); // post author
  
    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(post));
  
    const mockNotificationService = createNotificationServiceMock();
    const mockNotificationRepo = createNotificationRepositoryMock();
  
    const handler = new NotifyPostAuthorOnCommentCreation(
      mockUserRepo,
      mockPostRepo,
      mockNotificationService,
      mockNotificationRepo
    );
  
    await handler.onCommentCreated(new CommentCreated(comment));
  
    it("should not save a notification", () => {
      expect(mockNotificationRepo.save).toHaveBeenCalledTimes(0);
    });
  
    it("should not send a  notification", () => {
      expect(mockNotificationService.sendNotification).toHaveBeenCalledTimes(0);
    });
    });
});