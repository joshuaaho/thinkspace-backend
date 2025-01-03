import Joi from "joi";

//ALL DONE

const register = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[0-9W])(?=.*[a-zA-Z]).{8,15}$"))
      .required(),
    email: Joi.string().email().required(),
  }),
};

const login = {
  body: Joi.object({
    username: Joi.string()
      .required()
      .messages({ "any.required": "username is required" }),
    password: Joi.string()
      .required()
      .messages({ "any.required": "password is required" }),
  }),
};

export default { register, login };
