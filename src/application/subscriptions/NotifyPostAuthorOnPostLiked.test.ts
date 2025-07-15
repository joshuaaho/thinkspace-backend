import { describe, it, expect } from "vitest";
import NotifyPostAuthorOnPostLiked from "@application/subscriptions/NotifyPostAuthorOnPostLiked";
import {
  createUserRepositoryMock,
  createNotificationServiceMock,
  createNotificationRepositoryMock,
} from "@utils/testData/mocks";
import {
  createPostOne,
  createUserOne,
  createUserTwo,
} from "@utils/testData/testEntities";
import { Some } from "ts-results-es";
import PostLiked from "@domain/events/PostLiked";

describe("Notify Post Author On Post Liked", async () => {
  const author = createUserOne();
  const liker = createUserTwo();
  const post = createPostOne();

  const mockUserRepo = createUserRepositoryMock();
  mockUserRepo.findById
    .mockResolvedValueOnce(Some(author))
    .mockResolvedValueOnce(Some(liker));

  const mockNotificationService = createNotificationServiceMock();
  const mockNotificationRepo = createNotificationRepositoryMock();

  const handler = new NotifyPostAuthorOnPostLiked(
    mockUserRepo,
    mockNotificationService,
    mockNotificationRepo,
  );

  await handler.onPostLiked(new PostLiked(post));

  it("should save the notification", () => {
    expect(mockNotificationRepo.save).toHaveBeenCalledTimes(1);
  });

  it("should send the notification", () => {
    expect(mockNotificationService.sendNotification).toHaveBeenCalledTimes(1);
    expect(
      mockNotificationService.sendNotification.mock.calls[0][0],
    ).toMatchObject({
      to: author.id,
      from: liker.id,
      message: expect.stringContaining(liker.username.value),
      isRead: false,
      resourceId: post.id.value,
    });
  });
});
