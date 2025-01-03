import Joi from "joi";
import validatetId from "./id.validation.js";
//ALL DONE

const markAsRead = {
  params: Joi.object({
    notificationId: Joi.string().custom(validatetId).required(),
  }),
};

export default { markAsRead };
