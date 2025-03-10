import mongoose from 'mongoose';
import AppError from '#classes/AppError';
import 'dotenv/config';
import logger from '#utils/logger';
function errorHandler(err, req, res, next) {
  try {
    logger.error(err);

    if (process.env.ERROR_VERBOSE == "true") {
      return res.status(err.statusCode || 500).json(err.stack);
    }

    if (err.isJoi) {
      return res.status(400).json('Invalid Input Format. Please Retry With Valid Inputs');
    }

    if (err instanceof mongoose.Error) {
      return res.status(400).json('Internal Server Error. Please Try Again Or Wait Until Problem Is Solved');
    }

    if (err.name == 'JsonWebTokenError' || err.name == 'TokenExpiredError' || err.name == 'NotBeforeError') {
      return res.status(401).json('Authentication Error. Please Try To Login Again');
    }

    if (err instanceof AppError) {
      return res.status(err.statusCode).json(err.message);
    }

    return res.status(500).json('Internal Server Error. Please Try Again Or Wait Until Problem Is Solved');
  } catch {
    next(err);
  }
}

export default errorHandler;
