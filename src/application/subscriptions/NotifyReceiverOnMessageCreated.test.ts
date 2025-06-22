import MessageCreated from "@domain/events/MessageCreated";
import NotifyReceiverOnMessageCreated from "@application/subscriptions/NotifyReceiverOnMessageCreated";
import { createNotificationRepositoryMock } from "@utils/testData/mocks";
import { createNotificationServiceMock } from "@utils/testData/mocks";
import { createUserRepositoryMock } from "@utils/testData/mocks";
import { createUserOne , createUserTwo, createMessageOne} from "@utils/testData/testEntities";
import {describe, it, expect} from "vitest";
import { Some } from "ts-results-es";
describe("Notify Receiver On Message Created", async () => {
    const sender = createUserOne();
    const receiver = createUserTwo();

    const message = createMessageOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(sender))
      .mockResolvedValueOnce(Some(receiver));

    const mockNotificationService = createNotificationServiceMock();
    const mockNotificationRepo = createNotificationRepositoryMock();

    const handler = new NotifyReceiverOnMessageCreated(
      mockUserRepo,
      mockNotificationService,
      mockNotificationRepo
    );

    await handler.onMessageCreated(new MessageCreated(message));

    it("should save the notification", () => {
      expect(mockNotificationRepo.save).toHaveBeenCalledTimes(1);
    });

    it("should send the notification", () => {
      expect(mockNotificationService.sendNotification).toHaveBeenCalledTimes(1);
    });


});