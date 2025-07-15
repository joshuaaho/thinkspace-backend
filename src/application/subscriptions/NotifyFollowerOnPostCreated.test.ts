import { describe, it, expect } from "vitest";
import NotifyFollowerOnPostCreated from "@application/subscriptions/NotifyFollowerOnPostCreated";
import {
  createUserRepositoryMock,
  createNotificationServiceMock,
  createNotificationRepositoryMock,
} from "@utils/testData/mocks";
import { createPostOne, createUserOne } from "@utils/testData/testEntities";
import { Some } from "ts-results-es";
import PostCreated from "@domain/events/PostCreated";

describe("Notify Follower On Post Created", async () => {
  const author = createUserOne();

  const post = createPostOne();

  const mockUserRepo = createUserRepositoryMock();
  mockUserRepo.findById.mockResolvedValue(Some(author));

  const mockNotificationService = createNotificationServiceMock();
  const mockNotificationRepo = createNotificationRepositoryMock();

  const handler = new NotifyFollowerOnPostCreated(
    mockUserRepo,
    mockNotificationService,
    mockNotificationRepo,
  );

  await handler.onPostCreated(new PostCreated(post));

  it("should save the notification (2 in total)", () => {
    expect(mockNotificationRepo.save).toHaveBeenCalledTimes(2);
  });

  it("should send the notification to all followers (2 in total)", () => {
    expect(
      mockNotificationService.sendNotifications.mock.calls[0][0],
    ).toHaveLength(2);
  });
});
