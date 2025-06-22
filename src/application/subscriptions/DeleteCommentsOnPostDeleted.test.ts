import { describe, it, expect, vi } from "vitest";
import DeleteCommentsOnPostDeleted from "./DeleteCommentsOnPostDeleted";
import { createCommentRepositoryMock } from "@utils/testData/mocks";
import { createPostOne } from "@utils/testData/testEntities";
import PostDeleted from "@domain/events/PostDeleted";

describe("Delete Comments On Post Deleted", () => {
    describe("when handling post deletion", () => {
        const post = createPostOne();
        const mockCommentRepo = createCommentRepositoryMock();
        
        const handler = new DeleteCommentsOnPostDeleted(mockCommentRepo);
        
        // Call the handler method directly with the event
        handler.onPostDeleted(new PostDeleted(post));

        it("should delete all comments for the post", () => {
            expect(mockCommentRepo.deleteMany).toHaveBeenCalledWith({ 
                postId: post.id.value 
            });
        });
    });


}); 