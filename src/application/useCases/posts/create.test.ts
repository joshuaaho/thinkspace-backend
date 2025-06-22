import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createPostRepositoryMock,
} from "@utils/testData/mocks";
import { UnauthenticatedError } from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
import CreatePost from "./create";
import { createUserOne } from "@utils/testData/testEntities";
import { DomainEvents } from "@domain/events/DomainEvents";
import PostCreatedEvent from "@domain/events/PostCreated";
describe("Create Post Use Case", () => {
  describe("when creating a post", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    const createPost = new CreatePost(mockPostRepo);

    const result = await createPost.execute({
      title: "new post",
      content: "new post content",
      tags: ["test"],
      imgUrls: ["https://www.google.com"],
    },testUser);

    it("should save the post", () => {
      expect(mockPostRepo.save).toHaveBeenCalledOnce();
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
    it("mark the entity newly created entity", () => {
      expect(DomainEvents.getMarkedEntities().length).toBe(1);
    });
    it("entity should hold the event", () => {
      const domainEvent = DomainEvents.getMarkedEntities()[0].domainEvents[0];
      expect(domainEvent).toBeInstanceOf(PostCreatedEvent);
    });
  });



  describe("when post is not valid", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    const createPost = new CreatePost(mockPostRepo);

    const result = await createPost.execute({
      title: "",
      content: "",
      tags: ["test"],
      imgUrls: ["test"],
    },testUser);

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });
});
