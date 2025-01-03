import Joi from 'joi';
import validatetId from './id.validation.js';

const getUserById = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const queryUsers = {
  query: Joi.object({
    q: Joi.string().allow(''),
    offset: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const getUsersFollowers = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const getUsersFollowing = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const followUserById = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const unfollowUserById = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const getUsersFeed = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const getUsersChatList = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

const getUsersChatMessages = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
    chatId: Joi.string().custom(validatetId).required(),
  }),
};

const getUsersNotifications = {
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};
const updateUserById = Joi.object({
  params: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(15),
    password: Joi.string().pattern(new RegExp('^(?=.*[0-9W])(?=.*[a-zA-Z]).{8,15}$')),
    profileImgUrl: Joi.string(),
  }),
});

export default {
  getUserById,
  queryUsers,
  updateUserById,
  getUsersFeed,
  getUsersFollowers,
  getUsersFollowing,
  followUserById,
  unfollowUserById,
  getUsersNotifications,
  getUsersChatList,
  getUsersChatMessages,
};
