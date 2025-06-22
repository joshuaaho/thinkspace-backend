import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import { createUserRepositoryMock, createPostRepositoryMock } from "@utils/testData/mocks";
import { ResourceNotFoundError, UnauthenticatedError } from "@application/useCases/errors";
import { AlreadyLikedPostError, SelfLikedPostError } from "@domain/errors";
import LikePostUseCase from "@application/useCases/posts/like";
import { createUserOne, createPostOne, createUserThree, createUserTwo } from "@utils/testData/testEntities";
import { DomainEvents } from "@domain/events/DomainEvents";
import PostLikedEvent from "@domain/events/PostLiked";
describe("Like Post Use Case", () => {
  describe("when liking a post", async () => {
    const testUser = createUserThree();
    const testPost = createPostOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const likePost = new LikePostUseCase(mockPostRepo);

    const result = await likePost.execute({
      postId: testPost.id.value,
    },testUser);

    it("should add user to liked by array", () => {
      expect(testPost.likedBy.some((id) => id.equals(testUser.id))).toBe(true);
    });

    it("should save the post", () => {
      expect(mockPostRepo.save).toHaveBeenCalledWith(testPost);
    });

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });
    
       it("mark the entity newly created entity", () => {
      expect(DomainEvents.getMarkedEntities().length).toBe(1);
    });
    it("entity should hold the event", () => {
      const domainEvent = DomainEvents.getMarkedEntities()[0].domainEvents[0];
      expect(domainEvent).toBeInstanceOf(PostLikedEvent);
    });
  });


  describe("when post is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(None);  

    const likePost = new LikePostUseCase(mockPostRepo);

    const result = await likePost.execute({
      postId: "nonexistentId",
    },testUser);

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when liking own post", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const likePost = new LikePostUseCase(mockPostRepo);

    const result = await likePost.execute({
      postId: testPost.id.value,
    },testUser);

    it("should return self liked post error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(SelfLikedPostError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when post is already liked", async () => {
    const testUser = createUserTwo();
    const testPost = createPostOne();

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

      const likePost = new LikePostUseCase(mockPostRepo);

    const result = await likePost.execute({
      postId: testPost.id.value,
    },testUser  );

    it("should return already liked post error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(AlreadyLikedPostError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });
  
});
