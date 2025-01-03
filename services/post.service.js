import { Post, Notification } from '../models/index.js';
import AppError from '../classes/AppError.js';
import { toRegex } from '../utils/utils.js';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import { getReceiverSocketId, io } from '../socket/socket.js';

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

const createPost = async (newPostData, user) => {
  let newPost = null;
  let notificationList = null;
  const postsWithSameTitle = await Post.find({ title: newPostData.title });

  if (postsWithSameTitle.length != 0) {
    throw new AppError('Title has already been taken', 409);
  }

  await mongoose.connection.transaction(async (session) => {
    newPost = await Post.create(
      [
        {
          ...newPostData,
          authorId: user._id,
          content: sanitizeHtml(newPostData.content),
        },
      ],

      { session }
    );

    notificationList = user.followedBy.map((followerId) => ({
      from: user._id,
      to: followerId,
      redirectPath: `/posts/${newPost[0]._id}`,
      event: 'has a new post',
    }));

    notificationList = await Notification.insertMany(notificationList, {
      session,
      populate: { path: 'from', select: 'profileImgUrl username' },
    });
  });

  user.followedBy.map((followerId) => {
    const receiverSocketId = getReceiverSocketId(followerId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        'notifications',
        notificationList.filter((notification) => notification.to.equals(followerId))[0]
      );
    }
  });
  return newPost;
};

const queryPosts = async ({ tags = false, q = '', sort = '-postedAt', offset = 0, limit = 10 }) => {
  const qRegex = toRegex(q);
  const filteredPosts = await Post.find({
    ...(tags && { tags: { $in: tags } }),
  })
    .regex('title', qRegex)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate({ path: 'authorId', select: ['username', 'profileImgUrl'] });
  return filteredPosts;
};

const likePostById = async (postId, user) => {
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

  const updatedPost = await (
    await postToLike.likedBy.push(user._id).save()
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
  const receiverSocketId = getReceiverSocketId(postToLike.authorId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('notifications', notification);
  }

  return updatedPost;
};

const unlikePostById = async (postId, user) => {
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
  postToUnlike.likedBy = postToUnlike.likedBy.filter((likeId) => likeId != user._id);

  // Optimistic concurrency enabled so this way of saving documents preserves data integrity
  const updatedPost = await (
    await postToUnlike.save()
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });
  return updatedPost;
};

export default {
  getPostById,
  likePostById,
  unlikePostById,
  queryPosts,
  createPost,
};
