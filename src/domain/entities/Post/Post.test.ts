import Post from "@domain/entities/Post";
import Title from "@domain/entities/Post/Title";
import Content from "@domain/entities/Post/Content";
import Url from "@domain/common/Url";
import { expect, describe, it } from "vitest";
import EntityId from "@domain/core/EntityId";
import Tag from "@domain/entities/Post/Tag";
import {
  ValidationError,
  NotLikedPostError,
  AlreadyLikedPostError,
  SelfLikedPostError,
} from "@domain/errors";

import User from "@domain/entities/User";
import { UnauthorizedError } from "@application/useCases/errors";
import Email from "@domain/entities/User/Email";
import Username from "@domain/entities/User/Username";
import Password from "@domain/entities/User/Password";

describe("Post", () => {
  describe("creating a post with basic properties", () => {
    const authorId = EntityId.create("123");
    const title = Title.create("Test Title").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should have correct author id", () => {
      expect(post.authorId.equals(authorId)).toBe(true);
    });

    it("should have correct title", () => {
      expect(post.title.equals(title)).toBe(true);
    });

    it("should have correct content", () => {
      expect(post.content.equals(content)).toBe(true);
    });

    it("should have empty liked by list", () => {
      expect(post.likedBy).toEqual([]);
    });

    it("should have empty tags list", () => {
      expect(post.tags).toEqual([]);
    });

    it("should have empty image urls list", () => {
      expect(post.imgUrls).toEqual([]);
    });
  });

  describe("creating a post with too many tags", () => {
    const authorId = EntityId.create("123");
    const title = Title.create("Test Title").unwrap();
    const content = Content.create("Test content").unwrap();
    const tags = Array(6)
      .fill(null)
      .map((_, i) => Tag.create(`tag${i}`).unwrap());
    const result = Post.create({
      authorId,
      title,
      content,
      tags,
    });

    it("should return validation error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("adding a like to a post", () => {
    const authorId = EntityId.create("123");
    const likerId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    post.addLikeFromUser(likerId);

    it("should add the user to liked by list", () => {
      expect(post.likedBy).toContainEqual(likerId);
    });
  });

  describe("adding a like to a post that was already liked", () => {
    const authorId = EntityId.create("123");
    const likerId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    post.addLikeFromUser(likerId);
    const result = post.addLikeFromUser(likerId);

    it("should return already liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(AlreadyLikedPostError);
    });
  });

  describe("adding a like to own post", () => {
    const authorId = EntityId.create("123");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    const result = post.addLikeFromUser(authorId);

    it("should return self liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(SelfLikedPostError);
    });
  });

  describe("removing a like from a post", () => {
    const authorId = EntityId.create("123");
    const likerId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
      likedBy: [likerId],
    }).unwrap();

    post.removeLikeFromUser(likerId);

    it("should remove the user from liked by list", () => {
      expect(post.likedBy).not.toContainEqual(likerId);
    });
  });

  describe("removing a like from a post that was not liked", () => {
    const authorId = EntityId.create("123");
    const likerId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    const result = post.removeLikeFromUser(likerId);

    it("should return not liked error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(NotLikedPostError);
    });
  });

  describe("editing a post by author", () => {
    const authorId = EntityId.create("123");
    const post = Post.create({
      authorId,
      title: Title.create("Original Title").unwrap(),
      content: Content.create("Original content").unwrap(),
    }).unwrap();

    const author = User.create({
      id: authorId,
      username: Username.create("author").unwrap(),
      email: Email.create("author@example.com").unwrap(),
      password: Password.create({ value: "password123!#$B" }).unwrap(),
    });

    const newTitle = Title.create("New Title").unwrap();
    const newContent = Content.create("New content").unwrap();
    const newTags = [Tag.create("tag1").unwrap()];
    const newImgUrls = [Url.create("https://example.com/image.jpg").unwrap()];

    post.updateFromUserEdits(author, {
      title: newTitle,
      content: newContent,
      tags: newTags,
      imgUrls: newImgUrls,
    });

    it("should update the title", () => {
      expect(post.title.equals(newTitle)).toBe(true);
    });

    it("should update the content", () => {
      expect(post.content.equals(newContent)).toBe(true);
    });

    it("should update the tags", () => {
      expect(post.tags).toEqual(newTags);
    });

    it("should update the image urls", () => {
      expect(post.imgUrls).toEqual(newImgUrls);
    });
  });

  describe("editing a post by unauthorized user", () => {
    const authorId = EntityId.create("123");
    const unauthorizedId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Original Title").unwrap(),
      content: Content.create("Original content").unwrap(),
    }).unwrap();

    const unauthorizedUser = User.create({
      id: unauthorizedId,
      username: Username.create("unauthorized").unwrap(),
      email: Email.create("unauthorized@example.com").unwrap(),
      password: Password.create({ value: "password123!#$B" }).unwrap(),
    });

    const newTitle = Title.create("New Title").unwrap();
    const result = post.updateFromUserEdits(unauthorizedUser, {
      title: newTitle,
    });

    it("should return unauthorized error", () => {
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not update the title", () => {
      expect(post.title.equals(newTitle)).toBe(false);
    });
  });

  describe("checking if post can be deleted by author", () => {
    const authorId = EntityId.create("123");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    it("should return true", () => {
      expect(post.canBeDeletedBy(authorId)).toBe(true);
    });
  });

  describe("checking if post can be deleted by unauthorized user", () => {
    const authorId = EntityId.create("123");
    const unauthorizedId = EntityId.create("456");
    const post = Post.create({
      authorId,
      title: Title.create("Test Title").unwrap(),
      content: Content.create("Test content").unwrap(),
    }).unwrap();

    it("should return false", () => {
      expect(post.canBeDeletedBy(unauthorizedId)).toBe(false);
    });
  });
});

describe("Post Entity", () => {
  describe("create a post", () => {
    const authorId = EntityId.create("author1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should have the correct title", () => {
      expect(post.title).toEqual(title);
    });

    it("should have the correct content", () => {
      expect(post.content).toEqual(content);
    });

    it("should have the correct author ID", () => {
      expect(post.authorId).toEqual(authorId);
    });

    it("should have empty tags by default", () => {
      expect(post.tags).toEqual([]);
    });

    it("should have empty image URLs by default", () => {
      expect(post.imgUrls).toEqual([]);
    });

    it("should have empty liked by list by default", () => {
      expect(post.likedBy).toEqual([]);
    });

    it("should have a generated ID when not provided", () => {
      expect(post.id).toBeDefined();
    });
  });

  describe("create a post with too many tags", () => {
    const authorId = EntityId.create("author1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const tags = Array(6)
      .fill(null)
      .map((_, i) => Tag.create(`tag${i}`).unwrap());

    it("should return validation error", () => {
      const result = Post.create({
        authorId,
        title,
        content,
        tags,
      });

      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe("like a post", () => {
    const authorId = EntityId.create("author1");
    const userId = EntityId.create("user1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should add user to liked by list", () => {
      post.addLikeFromUser(userId);
      expect(post.likedBy.length).toBe(1);
    });
  });

  describe("like a post twice", () => {
    const authorId = EntityId.create("author1");
    const userId = EntityId.create("user1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should return error when liking twice", () => {
      post.addLikeFromUser(userId);
      const result = post.addLikeFromUser(userId);
      expect(result.unwrapErr()).toBeInstanceOf(AlreadyLikedPostError);
    });
  });

  describe("like own post", () => {
    const authorId = EntityId.create("author1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should return error when author likes own post", () => {
      const result = post.addLikeFromUser(authorId);
      expect(result.unwrapErr()).toBeInstanceOf(SelfLikedPostError);
    });
  });

  describe("unlike a post", () => {
    const authorId = EntityId.create("author1");
    const userId = EntityId.create("user1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should remove user from liked by list", () => {
      post.addLikeFromUser(userId);
      post.removeLikeFromUser(userId);
      expect(post.likedBy.length).toBe(0);
    });
  });

  describe("unlike a post that was not liked", () => {
    const authorId = EntityId.create("author1");
    const userId = EntityId.create("user1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should return error when unliking without liking", () => {
      const result = post.removeLikeFromUser(userId);
      expect(result.unwrapErr()).toBeInstanceOf(NotLikedPostError);
    });
  });

  describe("edit post", () => {
    const authorId = EntityId.create("author1");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();
    const author = User.create({
      id: authorId,
      email: Email.create("test@test.com").unwrap(),
      password: Password.create({ value: "Test123!@#B" }).unwrap(),
      username: Username.create("testuser").unwrap(),
    });
    const newTitle = Title.create("Updated Title").unwrap();
    const newContent = Content.create("Updated content").unwrap();
    const newTags = [Tag.create("tag1").unwrap()];
    const newImgUrls = [Url.create("https://example.com/image.jpg").unwrap()];

    it("should update title when edited by author", () => {
      post.updateFromUserEdits(author, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        imgUrls: newImgUrls,
      });
      expect(post.title).toEqual(newTitle);
    });

    it("should update content when edited by author", () => {
      post.updateFromUserEdits(author, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        imgUrls: newImgUrls,
      });
      expect(post.content).toEqual(newContent);
    });

    it("should update tags when edited by author", () => {
      post.updateFromUserEdits(author, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        imgUrls: newImgUrls,
      });
      expect(post.tags).toEqual(newTags);
    });

    it("should update image URLs when edited by author", () => {
      post.updateFromUserEdits(author, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        imgUrls: newImgUrls,
      });
      expect(post.imgUrls).toEqual(newImgUrls);
    });
  });

  describe("edit post by unauthorized user", () => {
    const authorId = EntityId.create("author1");
    const unauthorizedUserId = EntityId.create("user2");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();
    const unauthorizedUser = User.create({
      id: unauthorizedUserId,
      email: Email.create("test2@test.com").unwrap(),
      password: Password.create({ value: "Test123!@#B" }).unwrap(),
      username: Username.create("testuser2").unwrap(),
    });
    const newTitle = Title.create("Updated Title").unwrap();

    it("should return unauthorized error", () => {
      const result = post.updateFromUserEdits(unauthorizedUser, {
        title: newTitle,
      });
      expect(result.unwrapErr()).toBeInstanceOf(UnauthorizedError);
    });

    it("should not update post", () => {
      post.updateFromUserEdits(unauthorizedUser, {
        title: newTitle,
      });
      expect(post.title).toEqual(title);
    });
  });

  describe("delete post", () => {
    const authorId = EntityId.create("author1");
    const unauthorizedUserId = EntityId.create("user2");
    const title = Title.create("Test Post").unwrap();
    const content = Content.create("Test content").unwrap();
    const post = Post.create({
      authorId,
      title,
      content,
    }).unwrap();

    it("should allow author to delete post", () => {
      expect(post.canBeDeletedBy(authorId)).toBe(true);
    });

    it("should not allow other users to delete post", () => {
      expect(post.canBeDeletedBy(unauthorizedUserId)).toBe(false);
    });
  });
});
