import Joi from 'joi';
import validatetId from './id.validation.js';

//ALL DONE

const createPost = {
  body: Joi.object({
    title: Joi.string().trim().min(3).required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string().min(3).max(20)).max(5),
    uploadedImgs: Joi.array().items(Joi.string()),
  }),
};

const deletePostById = {
  params: Joi.object({
    postId: Joi.string().custom(validatetId).required(),
  }),
};
const getPostById = {
  params: Joi.object({
    postId: Joi.string().custom(validatetId).required(),
  }),
};

const queryPosts = {
  query: Joi.object({
    tags: Joi.array().items(Joi.string()),
    sort: Joi.string(),
    q: Joi.string().allow(''),
    offset: Joi.number(),
    limit: Joi.number(),
  }),
};

const updatePostById = {
  body: Joi.object({
    title: Joi.string().trim().min(3).required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string().min(3).max(20)).max(5),
  }),
};

const likePostById = {
  params: Joi.object({
    postId: Joi.string().custom(validatetId).required(),
  }),
};

const unlikePostById = {
  params: Joi.object({
    postId: Joi.string().custom(validatetId).required(),
  }),
};

export default {
  createPost,
  likePostById,
  unlikePostById,
  deletePostById,
  getPostById,

  updatePostById,
  queryPosts,
};
