import EntityId from "@domain/core/EntityId";
import User from "@domain/entities/User";
import UserName from "@domain/entities/User/Username";
import Email from "@domain/entities/User/Email";
import Password from "@domain/entities/User/Password";
import Post from "@domain/entities/Post";
import CommentContent from "@domain/entities/Comment/Content";
import PostContent from "@domain/entities/Post/Content";
import Title from "@domain/entities/Post/Title";
import Comment from "@domain/entities/Comment";

import Message from "@domain/entities/Message";
import Text from "@domain/entities/Message/Text";
import Tag from "@domain/entities/Post/Tag";

export const createUserOne = () => {
  return User.create({
    id: EntityId.create("userOneId"),
    username: UserName.create("userOne").unwrap(),
    email: Email.create("userOne@example.com").unwrap(),
    password: Password.create({ value: "SecurePass123!" }).unwrap(),
    refreshToken: "testRefreshToken",
    followedBy: [EntityId.create("userTwoId"), EntityId.create("userFourId")],
  });
};

export const createUserFour = () => {
  return User.create({
    id: EntityId.create("userFourId"),
    username: UserName.create("userFour").unwrap(),
    email: Email.create("userFour@example.com").unwrap(),
    password: Password.create({ value: "SecurePass123!" }).unwrap(),
    refreshToken: "testRefreshToken",
  });
};

export const createUserTwo = () => {
  return User.create({
    id: EntityId.create("userTwoId"),
    username: UserName.create("userTwo").unwrap(),
    email: Email.create("userTwo@example.com").unwrap(),
    password: Password.create({ value: "SecurePass123!" }).unwrap(),
  });
};

export const createUserThree = () => {
  return User.create({
    id: EntityId.create("userThreeId"),
    username: UserName.create("userThree").unwrap(),
    email: Email.create("userThree@example.com").unwrap(),
    password: Password.create({ value: "SecurePass123!" }).unwrap(),
  });
};

export const createPostOne = () => {
  return Post.create({
    id: EntityId.create("postOneId"),
    content: PostContent.create("Post one content").unwrap(),
    title: Title.create("Post one title").unwrap(),
    authorId: EntityId.create("userOneId"),
    likedBy: [EntityId.create("userTwoId")],
    createdAt: new Date("2024-01-01T10:00:00Z"),
  }).unwrap();
};

export const postOneUpdates = {
  content: "Updated post one content",
  title: "Updated post one title",
  tags: ["newTag1", "newTag2"],
  imgUrls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
};

export const invalidPostOneUpdates = {
  title: "a".repeat(101),
  tags: ["newTag1", "newTag2", "newTag3", "newTag4", "newTag5", "newTag6"],
  imgUrls: ["invalidurl"],
};

export const createPostTwo = () => {
  return Post.create({
    id: EntityId.create("postTwoId"),
    content: PostContent.create("Post two content").unwrap(),
    title: Title.create("Post two title").unwrap(),
    authorId: EntityId.create("userOneId"),
    createdAt: new Date("2024-01-15T10:00:00Z"),
  }).unwrap();
};

export const createPostThree = () => {
  return Post.create({
    id: EntityId.create("postThreeId"),
    content: PostContent.create("Post three content").unwrap(),
    title: Title.create("Typescript Programming").unwrap(),
    authorId: EntityId.create("userOneId"),
    tags: [
      Tag.create("typescript").unwrap(),
      Tag.create("programming").unwrap(),
    ],
    createdAt: new Date("2024-01-25T10:00:00Z"),
  }).unwrap();
};

export const createPostFour = () => {
  return Post.create({
    id: EntityId.create("postFourId"),
    content: PostContent.create("Post four content").unwrap(),
    title: Title.create("Python Programming").unwrap(),
    authorId: EntityId.create("userOneId"),
    tags: [Tag.create("python").unwrap(), Tag.create("programming").unwrap()],
    createdAt: new Date("2024-02-01T10:00:00Z"),
    likedBy: [EntityId.create("userTwoId"), EntityId.create("userOneId")],
  }).unwrap();
};

export const createCommentOne = () => {
  return Comment.create({
    id: EntityId.create("commentOneId"),
    content: CommentContent.create("Comment one content").unwrap(),
    authorId: EntityId.create("userOneId"),
    postId: EntityId.create("postOneId"),
    likedBy: [EntityId.create("userTwoId")],
  });
};

export const createCommentTwo = () => {
  return Comment.create({
    id: EntityId.create("commentTwoId"),
    content: CommentContent.create("Comment two content").unwrap(),
    authorId: EntityId.create("userTwoId"),
    postId: EntityId.create("postOneId"),
  });
};

export const createCommentFour = () => {
  return Comment.create({
    id: EntityId.create("commentFourId"),
    content: CommentContent.create("Comment four content").unwrap(),
    authorId: EntityId.create("userOneId"),
    postId: EntityId.create("postOneId"),
    parentCommentId: EntityId.create("commentOneId"),
  });
};

export const createCommentOneReply = () => {
  return Comment.create({
    id: EntityId.create("commentOneReplyId"),
    content: CommentContent.create("Comment one reply content").unwrap(),
    authorId: EntityId.create("userTwoId"),
    postId: EntityId.create("postOneId"),
    parentCommentId: EntityId.create("commentOneId"),
  });
};

export const createCommentOneReplyReply = () => {
  return Comment.create({
    id: EntityId.create("commentOneReplyReplyId"),
    content: CommentContent.create("Comment one reply reply content").unwrap(),
    authorId: EntityId.create("userThreeId"),
    postId: EntityId.create("postOneId"),
    parentCommentId: EntityId.create("commentOneReplyId"),
  });
};

export const createMessageOne = () => {
  return Message.create({
    id: EntityId.create("messageOneId"),

    text: Text.create("Hello, how are you?").unwrap(),
    senderId: EntityId.create("userOneId"),
    receiverId: EntityId.create("userTwoId"),
  });
};
