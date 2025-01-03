import Joi from "joi";
import validatetId from "./id.validation.js";
//ALL DONE

const getMessages = {
  query: Joi.object({
    chatId: Joi.string().custom(validatetId).required(),
  }),
};

export default { getMessages };
