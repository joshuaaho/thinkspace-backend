import pick from '#utils/pick';
import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const relevantData = pick(req, Object.keys(schema));

  const { error } = Joi.compile(validSchema).validate(relevantData, {
    abortEarly: false,
  });

  if (error) {
    return next(error);
  }

  return next();
};

export default validate;
