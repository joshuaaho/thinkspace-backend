import Post from '#models/post.model';
import Notification from '#models/notification.model';
import AppError from '#classes/AppError';
import toRegex from '#utils/toRegex';

import sanitizeHtml from 'sanitize-html';
import { getReceiverSocketId } from '../index.js';
import { socketIOSingleton } from '#socket/socket-factory';
import logger from '#utils/logger';
import { getUser } from '#utils/context';

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });

  if (!post) {
    throw new AppError('Post does not exist', 404);
  }

  return post;
};

const createPost = async (newPostData) => {
  const user = getUser();

  let newPost = null;
  let notificationList = null;
  const postsWithSameTitle = await Post.find({ title: newPostData.title });

  if (postsWithSameTitle.length != 0) {
    throw new AppError('Title has already been taken', 409);
  }

  newPost = await Post.create([
    {
      ...newPostData,
      authorId: user._id,
      content: sanitizeHtml(newPostData.content),
    },
  ]);

  logger.info('Post created successfully');

  notificationList = user.followedBy.map((followerId) => ({
    from: user._id,
    to: followerId,
    redirectPath: `/posts/${newPost[0]._id}`,
    event: 'has a new post',
  }));

  notificationList = await Notification.insertMany(notificationList, {
    populate: { path: 'from', select: 'profileImgUrl username' },
  });

  logger.info('Post created notification created');

  user.followedBy.map((followerId) => {
    const receiverSocketId = getReceiverSocketId(followerId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        'notifications',
        notificationList.filter((notification) => notification.to.equals(followerId))[0],
      );
    }
  });
  return newPost;
};

const queryPosts = async ({ tags = false, q = '', sort = '-postedAt', offset = 0, limit = 10 }) => {
  logger.info('Querying posts', { tags, query: q, sort, offset, limit });

  const qRegex = toRegex(q);
  const filteredPosts = await Post.find({
    ...(tags && { tags: { $in: tags } }),
  })
    .regex('title', qRegex)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate({ path: 'authorId', select: ['username', 'profileImgUrl'] });

  logger.info('Posts query completed');

  return filteredPosts;
};

const likePostById = async (postId) => {
  const user = getUser();

  const postToLike = await Post.findById(postId);

  if (!postToLike) {
    throw new AppError('Post does not exist', 404);
  }

  if (user._id.equals(postToLike.authorId)) {
    throw new AppError('You cannot like your own post', 403);
  }

  if (postToLike.likedBy.includes(user._id)) {
    throw new AppError('You have already liked the post', 400);
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postToLike._id }, // Filter to find the document
    { $push: { likedBy: user._id } },
    { new: true }, // Update operation to push the new value into the array
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });

  const notification = await Notification.create({
    from: user._id,
    to: postToLike.authorId,
    redirectPath: `/posts/${postId}`,
    event: 'has liked your post',
  });

  logger.info('Post liked successfully');

  const receiverSocketId = getReceiverSocketId(postToLike.authorId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('notifications', notification);
  }

  return updatedPost;
};

const unlikePostById = async (postId) => {
  const user = getUser();

  const postToUnlike = await Post.findById(postId);

  if (!postToUnlike) {
    throw new AppError('Post does not exist', 404);
  }

  if (user._id.equals(postToUnlike.authorId)) {
    throw new AppError('You cannot unlike your own post', 403);
  }

  if (!postToUnlike.likedBy.includes(user._id)) {
    throw new AppError('You have not liked the post', 400);
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postToUnlike._id }, // Filter to find the document
    { $pull: { likedBy: user._id } },
    { new: true }, // Update operation to push the new value into the array
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });

  logger.info('Post unliked successfully');
  return updatedPost;
};

export default {
  getPostById,
  likePostById,
  unlikePostById,
  queryPosts,
  createPost,
};
