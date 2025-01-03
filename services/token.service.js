import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import AppError from "../classes/AppError.js";
import "dotenv/config";

const generateAccessToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  );

  const user = await User.findById(userId);

  user.refreshToken = refreshToken;

  await user.save();

  return refreshToken;
};
const verifyAccessToken = async (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  return user;
};

const verifyRefreshToken = async (token) => {
  const { userId } = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);

  const user = await User.findById(userId).lean();

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  return user;
};

export default {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
