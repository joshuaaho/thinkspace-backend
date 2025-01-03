import AppError from "../classes/AppError.js";
import tokenService from "./token.service.js";
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";

const login = async (username, password) => {
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  const passwordIsMatch = await bcrypt.compare(password, user.password);

  if (!passwordIsMatch) {
    throw new AppError("Wrong password", 404);
  }

  const refreshToken = await tokenService.generateRefreshToken(user._id);

  const accessToken = await tokenService.generateAccessToken(user._id);

  return { refreshToken, accessToken };
};

const refresh = async (refreshToken) => {
  const user = await tokenService.verifyRefreshToken(refreshToken);

  const newAccessToken = await tokenService.generateAccessToken(user._id);

  return { newAccessToken };
};

const logout = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });

  user.refreshToken = null;
  await user.save();
};

export default { login, logout, refresh };
