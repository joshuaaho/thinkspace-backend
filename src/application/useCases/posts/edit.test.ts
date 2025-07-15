import Content from "@domain/entities/Post/Content";
import Title from "@domain/entities/Post/Title";
import valueEqual from "value-equal";
import { describe, it, expect } from "vitest";
import Url from "@domain/common/Url";
import EditPostUseCase from "./edit";
import { None, Some } from "ts-results-es";
import Tag from "@domain/entities/Post/Tag";
import {
  createUserRepositoryMock,
  createPostRepositoryMock,
} from "@utils/testData/mocks";
import { ResourceNotFoundError, UnauthorizedError } from "../errors";
import {
  createPostOne,
  createUserOne,
  createUserTwo,
  invalidPostOneUpdates,
  postOneUpdates,
} from "@utils/testData/testEntities";
import { ValidationError } from "@domain/errors";

describe("Edit Post Use Case", () => {
  describe("when user is not authorized", async () => {
    const testUser = createUserTwo();
    const testPost = createPostOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const editPost = new EditPostUseCase(mockPostRepo);
    const result = await editPost.execute(
      {
        ...postOneUpdates,
        postId: testPost.id.value,
      },
      testUser,
    );

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when user is authorized", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const editPost = new EditPostUseCase(mockPostRepo);
    const result = await editPost.execute(
      {
        ...postOneUpdates,
        postId: testPost.id.value,
      },
      testUser,
    );

    it("should return success", () => {
      expect(result.isOk()).toBe(true);
    });

    it("should update post title", () => {
      expect(
        testPost.title.equals(Title.create(postOneUpdates.title).unwrap()),
      ).toBe(true);
    });

    it("should update post content", () => {
      expect(
        testPost.content.equals(
          Content.create(postOneUpdates.content).unwrap(),
        ),
      ).toBe(true);
    });

    it("should update post image URLs", () => {
      expect(
        valueEqual(
          testPost.imgUrls,
          postOneUpdates.imgUrls.map((url) => Url.create(url).unwrap()),
        ),
      ).toBe(true);
    });

    it("should update post tags", () => {
      expect(
        valueEqual(
          testPost.tags,
          postOneUpdates.tags.map((tag) => Tag.create(tag).unwrap()),
        ),
      ).toBe(true);
    });

    it("should save the post", () => {
      expect(mockPostRepo.save).toHaveBeenCalledWith(testPost);
    });
  });

  describe("when post is not found", async () => {
    const testUser = createUserOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(None);

    const editPost = new EditPostUseCase(mockPostRepo);
    const result = await editPost.execute(
      {
        ...postOneUpdates,
        postId: "non-existent-post-id",
      },
      testUser,
    );

    it("should return resource not found error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });

  describe("when edits are invalid", async () => {
    const testUser = createUserOne();
    const testPost = createPostOne();
    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockPostRepo = createPostRepositoryMock();
    mockPostRepo.findById.mockResolvedValue(Some(testPost));

    const editPost = new EditPostUseCase(mockPostRepo);
    const result = await editPost.execute(
      {
        ...invalidPostOneUpdates,
        postId: testPost.id.value,
      },
      testUser,
    );

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it("should not save the post", () => {
      expect(mockPostRepo.save).not.toHaveBeenCalled();
    });
  });
});
