import mongoose from 'mongoose';
import AppError from '../classes/AppError.js';
import 'dotenv/config';

function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    return res.status(err.statusCode || 500).json(err.stack);
  }

  if (process.env.NODE_ENV == 'production') {
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
  }

  next(err);
}

export default errorHandler;
