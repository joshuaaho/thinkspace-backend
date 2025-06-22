import NotifyCommentAuthorOnCommentCreated from "@application/subscriptions/NotifyCommentAuthorOnCommentCreated";

import { createNotificationRepositoryMock } from "@utils/testData/mocks";
import { createNotificationServiceMock } from "@utils/testData/mocks";
import { createCommentRepositoryMock } from "@utils/testData/mocks";
import { createUserRepositoryMock } from "@utils/testData/mocks";
import { Some } from "ts-results-es";

import { createCommentOneReply } from "@utils/testData/testEntities";
import CommentCreated from "@domain/events/CommentCreated";

import { createUserOne , createUserTwo,createCommentOne, createCommentFour} from "@utils/testData/testEntities";
import { describe, it, expect } from "vitest";


describe("Notify Comment Author On Comment Created", async () => {

    describe("when another user replies to a comment", async () => {
    const parentCommentAuthor = createUserOne();
    const replier = createUserTwo();
    const parentComment = createCommentOne();
    const reply = createCommentOneReply();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(replier))  // reply author
      .mockResolvedValueOnce(Some(parentCommentAuthor)); // parent comment author

    const mockCommentRepo = createCommentRepositoryMock();
    mockCommentRepo.findById.mockResolvedValue(Some(parentComment));

    const mockNotificationService = createNotificationServiceMock();
    const mockNotificationRepo = createNotificationRepositoryMock();

    const handler = new NotifyCommentAuthorOnCommentCreated(
      mockUserRepo,
      mockCommentRepo,
      mockNotificationService,
      mockNotificationRepo
    );

    await handler.onCommentCreated(new CommentCreated(reply));

    it("should save the notification", () => {
      expect(mockNotificationRepo.save).toHaveBeenCalledOnce();
        });

    it("should send the notification", () => {
      expect(mockNotificationService.sendNotification).toHaveBeenCalledOnce();
    });
    });



    describe("when a user replies to his own comment", async () => {
  
        const replier = createUserOne();
        const parentComment = createCommentOne();
        const reply = createCommentFour();
    
        const mockUserRepo = createUserRepositoryMock();
        mockUserRepo.findById
          .mockResolvedValueOnce(Some(replier))  // reply author
          .mockResolvedValueOnce(Some(replier)); // parent comment author
    
        const mockCommentRepo = createCommentRepositoryMock();
        mockCommentRepo.findById.mockResolvedValue(Some(parentComment));
    
        const mockNotificationService = createNotificationServiceMock();
        const mockNotificationRepo = createNotificationRepositoryMock();
    
        const handler = new NotifyCommentAuthorOnCommentCreated(
          mockUserRepo,
          mockCommentRepo,
          mockNotificationService,
          mockNotificationRepo
        );
    
        await handler.onCommentCreated(new CommentCreated(reply));
    
        it("should not save anotification", () => {
          expect(mockNotificationRepo.save).not.toHaveBeenCalled();
            });
    
        it("should not send a notification", () => {
          expect(mockNotificationService.sendNotification).not.toHaveBeenCalled();
        });
        });
});