import { userService } from '../services/index.js';

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.userId, req.user);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const queryUsers = async (req, res, next) => {
  try {
    const filteredUsers = await userService.queryUsers(req.query, req.user);
    return res.status(200).json(filteredUsers);
  } catch (err) {
    return next(err);
  }
};

const getUsersNotifications = async (req, res, next) => {
  try {
    const userNotifications = await userService.getUsersNotifications(req.params.userId, req.user);
    return res.status(200).json(userNotifications);
  } catch (err) {
    return next(err);
  }
};

const followUserById = async (req, res, next) => {
  try {
    const updatedUser = await userService.followUserById(req.params.userId, req.user);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const unfollowUserById = async (req, res, next) => {
  try {
    const updatedUser = await userService.unfollowUserById(req.params.userId, req.user);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const getS3Url = async (req, res, next) => {
  try {
    const url = await userService.getS3Url();
    res.status(200).json({ url });
  } catch (err) {
    return next(err);
  }
};

export default {
  getUserById,
  queryUsers,
  followUserById,
  unfollowUserById,
  getUsersNotifications,
  getS3Url,
};
