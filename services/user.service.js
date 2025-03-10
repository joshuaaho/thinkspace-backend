import User from '#models/user.model';
import Notification from '#models/notification.model';
import AppError from '#classes/AppError';
import toRegex from '#utils/toRegex';
import aws from 'aws-sdk';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import logger from '#utils/logger';
import { getUser } from '#utils/context';

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User does not exist', 404);
  }
  return user;
};

const createUser = async (newUserData) => {
  const conflictingUser = await User.findOne({
    $or: [{ username: newUserData.username }, { email: newUserData.email }],
  });

  if (conflictingUser?.username === newUserData.username) {
    throw new AppError('Username already taken', 400);
  }

  if (conflictingUser?.email === newUserData.email) {
    throw new AppError('Email already taken', 400);
  }

  const hashedPassword = await bcrypt.hash(newUserData.password, 8);

  const createdUser = await User.create({
    ...newUserData,
    password: hashedPassword,
  });

  logger.info('User created');
  return createdUser;
};

const getUsersNotifications = async (userId) => {
  const user = getUser();

  if (!user._id.equals(userId)) {
    throw new AppError('You do not own the users notification', 403);
  }

  const notifications = await Notification.find({
    to: userId,
  }).populate({ path: 'from', select: 'username profileImgUrl' });

  return notifications;
};

const queryUsers = async ({ q = '', offset = 0, limit = 10 }) => {
  const qRegex = toRegex(q);
  const userResults = await User.find().regex('username', qRegex).skip(offset).limit(limit);

  return userResults;
};

const followUserById = async (userToFollowId, user) => {
  if (user._id.equals(userToFollowId)) {
    throw new AppError('Cannot follow yourself', 400);
  }

  const userToFollow = await User.findById(userToFollowId);
  if (!userToFollow) {
    throw new AppError('User does not exist', 404);
  }

  if (userToFollow.followedBy.includes(user._id)) {
    throw new AppError('You have already followed this user', 400);
  }
  const updatedUser = await User.findByIdAndUpdate(
    userToFollowId,
    {
      $push: { followedBy: user._id },
    },
    { new: true },
  );

  return updatedUser;
};

const unfollowUserById = async (userToUnfollowId, user) => {
  if (user._id.equals(userToUnfollowId)) {
    throw new AppError('Cannot unfollow yourself', 400);
  }

  const userToUnfollow = await User.findById(userToUnfollowId);
  if (!userToUnfollow) {
    throw new AppError('User not found', 404);
  }

  if (!userToUnfollow.followedBy.includes(user._id)) {
    throw new AppError('You have not followed this user', 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userToUnfollowId,
    {
      $pull: { followedBy: user._id },
    },
    { new: true },
  );

  logger.info('User updated');
  return updatedUser;
};

const getS3Url = async () => {
  const s3 = new aws.S3({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETACCESSKEY,
    signatureVersion: 'v4',
  });

  const params = {
    Bucket: process.env.S3_BUCKETNAME,
    Key: uuidv4(),
    Expires: 240,
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
};

export default {
  getUsersNotifications,
  getUserById,
  createUser,
  queryUsers,
  followUserById,
  unfollowUserById,
  getS3Url,
};
