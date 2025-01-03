import { commentService } from '../services/index.js';

const createComment = async (req, res, next) => {
  try {
    const newComment = await commentService.createComment(req.body, req.user);
    return res.status(200).json(newComment);
  } catch (err) {
    return next(err);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    const deletedComment = await commentService.deleteCommentById(req.params.commentId, req.user);

    return res.status(200).json(deletedComment);
  } catch (err) {
    return next(err);
  }
};

const queryComments = async (req, res, next) => {
  try {
    const filteredComments = await commentService.queryComments(req.query);

    return res.status(200).json(filteredComments);
  } catch (err) {
    return next(err);
  }
};

const updateCommentById = async (req, res, next) => {
  try {
    const updatedComment = await commentService.updateCommentById(req.params.commentId, req.body.content, req.user);

    return res.status(200).json(updatedComment);
  } catch (err) {
    return next(err);
  }
};

const likeCommentById = async (req, res, next) => {
  try {
    const updatedComment = await commentService.likeCommentById(req.params.commentId, req.user);

    return res.status(200).json(updatedComment);
  } catch (err) {
    return next(err);
  }
};

const unlikeCommentById = async (req, res, next) => {
  try {
    const updatedComment = await commentService.unlikeCommentById(req.params.commentId, req.user);
    return res.status(200).json(updatedComment);
  } catch (err) {
    return next(err);
  }
};

export default {
  createComment,
  queryComments,
  likeCommentById,
  unlikeCommentById,
  updateCommentById,
  deleteCommentById,
};
