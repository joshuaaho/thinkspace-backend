import bcrypt from "bcryptjs";
import { beforeEach } from "vitest";

import container from "@containers/index";
import IUserRepository from "@domain/repositories/IUserRepository";
import CONSTANTS from "@containers/constants";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import IMessageRepository from "@domain/repositories/IMessageRepository";

export const hashPassword = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

const userRepository = container.get<IUserRepository>(CONSTANTS.UserRepository);
const commentRepository = container.get<ICommentRepository>(
  CONSTANTS.CommentRepository
);
const postRepository = container.get<IPostRepository>(CONSTANTS.PostRepository);
const notificationRepository = container.get<INotificationRepository>(
  CONSTANTS.NotificationRepository
);
const messageRepository = container.get<IMessageRepository>(
  CONSTANTS.MessageRepository
);

beforeEach(async () => {
  await clearDatabase();
});
export async function clearDatabase() {
  await userRepository.deleteAll();
  await commentRepository.deleteAll();
  await postRepository.deleteAll();
  await notificationRepository.deleteAll();
  await messageRepository.deleteAll();
}
