import { describe, it, expect, vi } from "vitest";
import DeleteRepliesOnCommentDeleted from "@application/subscriptions/DeleteRepliesOnCommentDeleted";
import { createCommentRepositoryMock } from "@utils/testData/mocks";
import { createCommentOne, createCommentOneReply } from "@utils/testData/testEntities";
import CommentDeleted from "@domain/events/CommentDeleted";

describe("Delete Replies On Comment Deleted", () => {
   
        const comment = createCommentOne();
        const commentReply = createCommentOneReply();
        const mockCommentRepo = createCommentRepositoryMock();
        mockCommentRepo.query.mockResolvedValue([commentReply]);
        const handler = new DeleteRepliesOnCommentDeleted(mockCommentRepo);
        
        // Call the handler method directly with the event
        handler.onCommentDeleted(new CommentDeleted(comment));

        it("should delete all direct replies for the comment", () => {
            expect(mockCommentRepo.deleteMany).toHaveBeenCalledWith({ 
                parentCommentId: comment.id.value 
            });
        });

        it("should register events for replies", () => {
            expect(commentReply.domainEvents.length).toBe(1);
        });

 


});
