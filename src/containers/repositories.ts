import { Container } from "inversify";
import MongoUserRepository from "@infrastructure/repositories/mongodb/MongoUserRepository";
import MongoNotificationRepository from "@infrastructure/repositories/mongodb/MongoNotificationRepository";
import MongoPostRepository from "@infrastructure/repositories/mongodb/MongoPostRepository";
import MongoCommentRepository from "@infrastructure/repositories/mongodb/MongoCommentRepository";
import MongoMessageRepository from "@infrastructure/repositories/mongodb/MongoMessageRepository";
import IUserRepository from "@domain/repositories/IUserRepository";
import INotificationRepository from "@domain/repositories/INotificationRepository";
import IPostRepository from "@domain/repositories/IPostRepository";
import ICommentRepository from "@domain/repositories/ICommentRepository";
import IMessageRepository from "@domain/repositories/IMessageRepository";
import CONSTANTS from "@containers/constants";

export function bindRepositories(container: Container) {
  container
    .bind<IUserRepository>(CONSTANTS.UserRepository)
    .to(MongoUserRepository);
  container
    .bind<INotificationRepository>(CONSTANTS.NotificationRepository)
    .to(MongoNotificationRepository);
  container
    .bind<IPostRepository>(CONSTANTS.PostRepository)
    .to(MongoPostRepository);
  container
    .bind<ICommentRepository>(CONSTANTS.CommentRepository)
    .to(MongoCommentRepository);
  container
    .bind<IMessageRepository>(CONSTANTS.MessageRepository)
    .to(MongoMessageRepository);
}
