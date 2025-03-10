import Joi from 'joi';
import validatetId from './id.validation.js';

const createChat = {
  body: Joi.object({
    recipientId: Joi.string().custom(validatetId).required(),
  }),
};

const getChats = {
  query: Joi.object({
    userId: Joi.string().custom(validatetId).required(),
  }),
};

export default { createChat, getChats };
