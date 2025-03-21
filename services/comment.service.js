import Comment from '#models/comment.model';
import Post from '#models/post.model';
import Notification from '#models/notification.model';
import AppError from '#classes/AppError';
import { getReceiverSocketId } from '../index.js';
import { socketIOSingleton } from '#socket/socket-factory';
import { getUser } from '#utils/context';

const createComment = async (newCommentData) => {
  const user = getUser();
  const commentPost = await Post.findById(newCommentData.postId);

  if (!commentPost) {
    throw new AppError('Post does not exist', 404);
  }

  let parentComment = null;
  if (newCommentData.parentCommentId) {
    parentComment = await Comment.findById(newCommentData.parentCommentId);

    if (!parentComment) {
      throw new AppError('The comment you are replying to does not exist', 404);
    }
    if (!commentPost._id.equals(parentComment.postId)) {
      throw new AppError('The comment you are replying to does not exist in the specified post', 400);
    }
  }
  const newComment = await (
    await Comment.create({
      authorId: user._id,
      ...newCommentData,
    })
  ).populate({
    path: 'authorId', // The field you want to populate
    select: 'username profileImgUrl', // Specify which fields to include from the populated document
  });

  const notificationToSend = {
    to: newCommentData.parentCommentId ? parentComment.authorId : commentPost.authorId,
    from: user._id,
    redirectPath: `/posts/${commentPost._id}`,
    event: newCommentData.parentCommentId ? 'has replied to your comment' : 'has commented on your post',
  };

  const notification = await (
    await Notification.create(notificationToSend)
  ).populate({
    path: 'from',
    select: 'profileImgUrl username',
  });
  const receiverSocketId = getReceiverSocketId(notificationToSend.to);
  if (receiverSocketId) {
    socketIOSingleton.to(receiverSocketId).emit('notifications', notification);
  }

  return newComment;
};

const updateCommentById = async (commentId, newContent) => {
  const user = getUser();
  const commentToUpdate = await Comment.findById(commentId).populate('postId');

  if (!commentToUpdate) {
    throw new AppError('Comment not found', 404);
  }

  if (!user._id.equals(commentToUpdate.authorId)) {
    throw new AppError('Only the author of this comment can update it', 403);
  }

  commentToUpdate.content = newContent;

  const updatedComment = await (
    await commentToUpdate.save()
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });

  return updatedComment;
};

const deleteCommentById = async (commentId) => {
  const user = getUser();
  const commentToDelete = await Comment.findById(commentId);

  if (!commentToDelete) {
    throw new AppError('Comment not found', 404);
  }

  if (!user._id.equals(commentToDelete.authorId)) {
    throw new AppError('Only the author of this comment can delete it', 403);
  }

  const commentsToDelete = [];

  // Delete all nested comments
  async function fetchComments(id) {
    const comment = await Comment.findById(id);
    if (comment) {
      commentsToDelete.push(comment);
      const childComments = await Comment.find({
        parentCommentId: comment._id,
      });
      for (const child of childComments) {
        await fetchComments(child._id); // Recursive call for each child
      }
    }
  }

  await fetchComments(commentToDelete._id);

  await Promise.all(
    commentsToDelete.map(async (comment) => {
      await Comment.deleteOne(comment);
    }),
  );

  return commentsToDelete;
};
const queryComments = async ({ postId, sort = 'postedAt', offset, limit }) => {
  const filteredComments = await Comment.find({
    ...(postId && { postId: postId }),
  })
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .populate({ path: 'authorId', select: ['username', 'profileImgUrl'] });

  return filteredComments;
};

const likeCommentById = async (commentId) => {
  const user = getUser();
  const commentToLike = await Comment.findById(commentId);

  if (!commentToLike) {
    throw new AppError('Comment does not exist', 404);
  }

  if (commentToLike.likedBy.includes(user._id)) {
    throw new AppError('You have already liked the comment', 400);
  }

  if (user._id.equals(commentToLike.authorId)) {
    throw new AppError('You cannot like your own comment', 403);
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentToLike._id }, // Filter to find the document
    { $push: { likedBy: user._id } },
    { new: true }, // Update operation to push the new value into the array
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });

  const notification = await (
    await Notification.create({
      from: user._id,
      to: commentToLike.authorId,
      redirectPath: `/posts/${commentToLike.postId}`,
      event: 'has liked your comment',
    })
  ).populate({
    path: 'from',
    select: 'profileImgUrl username',
  });

  const receiverSocketId = getReceiverSocketId(commentToLike.authorId);
  if (receiverSocketId) {
    socketIOSingleton.to(receiverSocketId).emit('notifications', notification);
  }

  return updatedComment;
};

const unlikeCommentById = async (commentId) => {
  const user = getUser();
  const commentToUnlike = await Comment.findById(commentId);

  if (!commentToUnlike) {
    throw new AppError('Comment does not exist', 404);
  }

  if (!commentToUnlike.likedBy.includes(user._id)) {
    throw new AppError('You have not liked this comment', 404);
  }

  if (user._id.equals(commentToUnlike.authorId)) {
    throw new AppError('You cannot unlike your own comment', 403);
  }

  commentToUnlike.likedBy = commentToUnlike.likedBy.filter((likeId) => likeId != user._id);

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentToUnlike._id }, // Filter to find the document
    { $pull: { likedBy: user._id } },
    { new: true }, // Update operation to push the new value into the array
  ).populate({
    path: 'authorId',
    select: ['username', 'profileImgUrl'],
  });
  return updatedComment;
};

export default {
  queryComments,
  updateCommentById,
  createComment,
  deleteCommentById,
  likeCommentById,
  unlikeCommentById,
};
