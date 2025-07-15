import { describe, it, expect } from "vitest";
import {
  createPostRepositoryMock,
  createUserRepositoryMock,
} from "@utils/testData/mocks";
import { createPostOne, createUserOne } from "@utils/testData/testEntities";
import QueryPostsUseCase from "@application/useCases/posts/query";
import { Some } from "ts-results-es";

describe("Query Posts Use Case", () => {
  describe("when querying posts with filters and pagination", async () => {
    const testPost = createPostOne();

    const testUser = createUserOne();
    const mockPostRepo = createPostRepositoryMock();
    const mockUserRepo = createUserRepositoryMock();
    mockPostRepo.query.mockResolvedValue([testPost]);
    mockUserRepo.findById.mockResolvedValue(Some(testUser));
    const queryPosts = new QueryPostsUseCase(mockPostRepo, mockUserRepo);

    const result = await queryPosts.execute({
      offset: 0,
      limit: 10,
      tags: ["test"],
      sortBy: "newest",
    });

    it("should return the posts with correct shape", () => {
      expect(result).toEqual([
        {
          authorId: testPost.authorId.value,
          username: testUser.username.value,
          authorProfileImgUrl: testUser.profileImgUrl.value,
          id: testPost.id.value,
          title: testPost.title.value,
          content: testPost.content.value,
          createdAt: testPost.createdAt.toString(),
          tags: testPost.tags.map((tag) => tag.value),
          likedBy: testPost.likedBy.map((userId) => userId.value),
          imgUrls: testPost.imgUrls.map((imgUrl) => imgUrl.value),
          commentedBy: testPost.commentedBy.map((userId) => userId.value),
        },
      ]);
    });
  });
});
