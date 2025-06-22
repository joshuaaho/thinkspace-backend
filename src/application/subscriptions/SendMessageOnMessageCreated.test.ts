import { describe, it, expect } from "vitest";
import SendMessageOnMessageCreated from "@application/subscriptions/SendMessageOnMessageCreated";
import {
  createMessageServiceMock,
  createUserRepositoryMock,
} from "@utils/testData/mocks";
import { createMessageOne, createUserOne } from "@utils/testData/testEntities";
import MessageCreated from "@domain/events/MessageCreated";

describe("Send Message On Message Created", async () => {
  const message = createMessageOne();
  const user = createUserOne();
  const mockMessageService = createMessageServiceMock();
  const mockUserRepository = createUserRepositoryMock();
  mockUserRepository.findById.mockResolvedValue(user);
  const handler = new SendMessageOnMessageCreated(
    mockMessageService,
    mockUserRepository
  );

  await handler.onMessageCreated(new MessageCreated(message));

  it("should send the message", () => {
    expect(mockMessageService.sendMessage).toHaveBeenCalledTimes(1);
  });
});
