import { Container } from "inversify";

import { GetByIdController } from "@presentation/controllers/users/getById";
import { GetMeController } from "@presentation/controllers/users/getMe";
import { EditUserController } from "@presentation/controllers/users/edit";
import { FollowController } from "@presentation/controllers/users/follow";
import { UnfollowController } from "@presentation/controllers/users/unfollow";
import { QueryUsersController } from "@presentation/controllers/users/query";
import { QueryNotificationsController } from "@presentation/controllers/notifications/query";
import { GetUnreadCountController } from "@presentation/controllers/notifications/getUnreadCount";
import { MarkAsReadController } from "@presentation/controllers/notifications/markAsRead";
import { CreatePostController } from "@presentation/controllers/posts/create";
import { DeletePostController } from "@presentation/controllers/posts/delete";
import { EditPostController } from "@presentation/controllers/posts/edit";
import { GetPostByIdController } from "@presentation/controllers/posts/getById";
import { LikePostController } from "@presentation/controllers/posts/like";
import { UnlikePostController } from "@presentation/controllers/posts/unlike";
import { QueryPostController } from "@presentation/controllers/posts/query";
import { CreateCommentController } from "@presentation/controllers/comments/create";
import { DeleteCommentController } from "@presentation/controllers/comments/delete";
import { EditCommentController } from "@presentation/controllers/comments/edit";
import { LikeCommentController } from "@presentation/controllers/comments/like";
import { UnlikeCommentController } from "@presentation/controllers/comments/unlike";
import { QueryCommentsController } from "@presentation/controllers/comments/query";
import { QueryMessagesController } from "@presentation/controllers/messages/query";
import { GetChatListController } from "@presentation/controllers/messages/getChatList";
import { CreateMessageController } from "@presentation/controllers/messages/create";
import { CreateFileUploadUrlController } from "@presentation/controllers/files/createFileUploadUrl";
import { LoginController } from "@presentation/controllers/auth/login";
import { RegisterController } from "@presentation/controllers/auth/register";
import { LogoutController } from "@presentation/controllers/auth/logout";
import { RefreshController } from "@presentation/controllers/auth/refresh";

export function bindControllers(container: Container) {
  // User controllers
  container.bind<GetByIdController>(GetByIdController).toSelf();

  container.bind<GetMeController>(GetMeController).toSelf();
  container.bind<EditUserController>(EditUserController).toSelf();
  container.bind<FollowController>(FollowController).toSelf();
  container.bind<UnfollowController>(UnfollowController).toSelf();
  container.bind<QueryUsersController>(QueryUsersController).toSelf();

  // Notification controllers
  container
    .bind<QueryNotificationsController>(QueryNotificationsController)
    .toSelf();
  container.bind<GetUnreadCountController>(GetUnreadCountController).toSelf();
  container.bind<MarkAsReadController>(MarkAsReadController).toSelf();

  // Post controllers
  container.bind<CreatePostController>(CreatePostController).toSelf();
  container.bind<DeletePostController>(DeletePostController).toSelf();
  container.bind<EditPostController>(EditPostController).toSelf();
  container.bind<GetPostByIdController>(GetPostByIdController).toSelf();
  container.bind<LikePostController>(LikePostController).toSelf();
  container.bind<UnlikePostController>(UnlikePostController).toSelf();
  container.bind<QueryPostController>(QueryPostController).toSelf();

  // Comment controllers
  container.bind<CreateCommentController>(CreateCommentController).toSelf();
  container.bind<DeleteCommentController>(DeleteCommentController).toSelf();
  container.bind<EditCommentController>(EditCommentController).toSelf();

  container.bind<LikeCommentController>(LikeCommentController).toSelf();
  container.bind<UnlikeCommentController>(UnlikeCommentController).toSelf();
  container.bind<QueryCommentsController>(QueryCommentsController).toSelf();

  // Message controllers
  container.bind<QueryMessagesController>(QueryMessagesController).toSelf();
  container.bind<CreateMessageController>(CreateMessageController).toSelf();
  container.bind<GetChatListController>(GetChatListController).toSelf();

  // File upload controllers
  container
    .bind<CreateFileUploadUrlController>(CreateFileUploadUrlController)
    .toSelf();

  container.bind<LoginController>(LoginController).toSelf();
  container.bind<RegisterController>(RegisterController).toSelf();
  container.bind<LogoutController>(LogoutController).toSelf();
  container.bind<RefreshController>(RefreshController).toSelf();
}
