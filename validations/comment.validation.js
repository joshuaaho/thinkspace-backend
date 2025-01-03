import Joi from "joi";
import validatetId from "./id.validation.js";

//ALL DONE
const createComment = {
  body: Joi.object({
    content: Joi.string().trim().min(3).required(),
    parentCommentId: Joi.string().custom(validatetId),
    postId: Joi.string().custom(validatetId).required(),
  }),
};

const deleteCommentById = {
  params: Joi.object({
    commentId: Joi.string().custom(validatetId).required(),
  }),
};

const likeCommentById = {
  params: Joi.object({
    commentId: Joi.string().custom(validatetId).required(),
  }),
};

const unlikeCommentById = {
  params: Joi.object({
    commentId: Joi.string().custom(validatetId).required(),
  }),
};

const queryComments = {
  query: Joi.object({
    postId: Joi.string().custom(validatetId),
    userId: Joi.string().custom(validatetId),
    sort: Joi.string(),
    offset: Joi.number(),
    limit: Joi.number(),
  }),
};

const updateCommentById = {
  params: Joi.object({
    commentId: Joi.string().custom(validatetId).required(),
  }),
  body: Joi.object({
    content: Joi.string().trim().min(3).required(),
  }),
};

export default {
  createComment,
  likeCommentById,
  unlikeCommentById,
  deleteCommentById,
  updateCommentById,
  queryComments,
};
