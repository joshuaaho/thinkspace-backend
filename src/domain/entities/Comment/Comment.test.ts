import { describe, it, expect } from "vitest";
import Comment from "@domain/entities/Comment";
import EntityId from "@domain/core/EntityId";
import { AlreadyLikedCommentError, NotLikedCommentError } from "@domain/errors";
import { UnauthorizedError } from "@application/useCases/errors";
import Content from "@domain/entities/Comment/Content";

describe("Comment", () => {
  describe("creating a comment with basic properties", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const content = Content.create("Valid comment content").unwrap();
    const comment = Comment.create({
      content,
      authorId,
      postId,
    });

    it("should have correct content", () => {
      expect(comment.content.equals(content)).toBe(true);
    });

    it("should have correct author id", () => {
      expect(comment.authorId.equals(authorId)).toBe(true);
    });

    it("should have correct post id", () => {
      expect(comment.postId.equals(postId)).toBe(true);
    });

    it("should have empty liked by list", () => {
      expect(comment.likedBy).toEqual([]);
    });
  });

  describe("adding a like to a comment", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const likerId = EntityId.create("3");
    const comment = Comment.create({
      content: Content.create("Test comment").unwrap(),
      authorId,
      postId,
    });

    comment.addLikeFromUser(likerId);

    it("should add the user to liked by list", () => {
      expect(comment.likedBy).toContainEqual(likerId);
    });
  });

  describe("adding a like to a comment that was already liked", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const likerId = EntityId.create("3");
    const comment = Comment.create({
      content: Content.create("Test comment").unwrap(),
      authorId,
      postId,
    });

    comment.addLikeFromUser(likerId);
    const result = comment.addLikeFromUser(likerId);

    it("should return already liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(AlreadyLikedCommentError);
    });
  });

  describe("removing a like from a comment", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const likerId = EntityId.create("3");
    const comment = Comment.create({
      content: Content.create("Test comment").unwrap(),
      authorId,
      postId,
    });

    comment.addLikeFromUser(likerId);
    comment.removeLikeFromUser(likerId);

    it("should remove the user from liked by list", () => {
      expect(comment.likedBy).not.toContainEqual(likerId);
    });
  });

  describe("removing a like from a comment that was not liked", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const likerId = EntityId.create("3");
    const comment = Comment.create({
      content: Content.create("Test comment").unwrap(),
      authorId,
      postId,
    });

    const result = comment.removeLikeFromUser(likerId);

    it("should return not liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(NotLikedCommentError);
    });
  });

  describe("editing a comment by author", () => {
    const authorId = EntityId.create("1");
    const postId = EntityId.create("2");
    const content = Content.create("Original content").unwrap();
    const comment = Comment.create({
      content,
      authorId,
      postId,
    });

    const newContent = Content.create("Updated content").unwrap();
    comment.updateCommentFromUser(authorId, newContent);

    it("should update the content", () => {
      expect(comment.content.equals(newContent)).toBe(true);
    });
  });

  describe("editing a comment by unauthorized user", () => {
    const authorId = EntityId.create("1");
    const unauthorizedId = EntityId.create("2");
    const postId = EntityId.create("3");
    const content = Content.create("Original content").unwrap();
    const comment = Comment.create({
      content,
      authorId,
      postId,
    });

    const newContent = Content.create("Updated content").unwrap();
    const result = comment.updateCommentFromUser(unauthorizedId, newContent);

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not update the content", () => {
      expect(comment.content.equals(content)).toBe(true);
    });
  });
});
