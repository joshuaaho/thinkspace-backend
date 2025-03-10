import jwt from 'jsonwebtoken';
import User from '#models/user.model';
import AppError from '#classes/AppError';
import 'dotenv/config';
import logger from '#utils/logger';

const generateAccessToken = async (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });

  logger.info('Access token generated');

  return token;
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION,
  });

  logger.info('Refresh token generated');

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.refreshToken = refreshToken;

  await user.save();

  logger.info('Refresh token saved');
  return refreshToken;
};
const verifyAccessToken = async (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

  logger.info('Access token verified');
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  return user;
};

const verifyRefreshToken = async (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);

  logger.info('Refresh token verified');
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  return user;
};

export default {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
