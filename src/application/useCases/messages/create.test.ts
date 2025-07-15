import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createMessageRepositoryMock,
} from "@utils/testData/mocks";
import {
  InvalidRequestError,
  ResourceNotFoundError,
} from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import { createUserOne, createUserTwo } from "@utils/testData/testEntities";
import CreateMessageUseCase from "./create";

describe("Create Message Use Case", () => {
  describe("when recipient is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValueOnce(None);
    const mockMessageRepo = createMessageRepositoryMock();

    const createMessage = new CreateMessageUseCase(
      mockMessageRepo,
      mockUserRepo,
    );

    const result = await createMessage.execute(
      {
        recipientId: "non-existent-user-id",
        text: "Hello",
      },
      testUser,
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save  message", () => {
      expect(mockMessageRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when message is invalid", async () => {
    const testUser = createUserOne();
    const testRecipient = createUserTwo();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(testUser))
      .mockResolvedValueOnce(Some(testRecipient));

    const mockMessageRepo = createMessageRepositoryMock();

    const createMessage = new CreateMessageUseCase(
      mockMessageRepo,
      mockUserRepo,
    );

    const result = await createMessage.execute(
      {
        recipientId: testRecipient.id.value,
        text: "",
      },
      testUser,
    );

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should not save a message", () => {
      expect(mockMessageRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when sending message to self", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(testUser))
      .mockResolvedValueOnce(Some(testUser));

    const mockMessageRepo = createMessageRepositoryMock();

    const createMessage = new CreateMessageUseCase(
      mockMessageRepo,
      mockUserRepo,
    );

    const result = await createMessage.execute(
      {
        recipientId: testUser.id.value,
        text: "Hello",
      },
      testUser,
    );

    it("should return invalid request error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(InvalidRequestError);
    });

    it("should not save message", () => {
      expect(mockMessageRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when sending message successfully", async () => {
    const testUser = createUserOne();
    const testRecipient = createUserTwo();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById
      .mockResolvedValueOnce(Some(testUser))
      .mockResolvedValueOnce(Some(testRecipient));

    const mockMessageRepo = createMessageRepositoryMock();

    const createMessage = new CreateMessageUseCase(
      mockMessageRepo,
      mockUserRepo,
    );

    const result = await createMessage.execute(
      {
        recipientId: testRecipient.id.value,
        text: "Hello",
      },
      testUser,
    );

    it("should save the message", () => {
      expect(mockMessageRepo.save).toHaveBeenCalled();
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
  });
});
